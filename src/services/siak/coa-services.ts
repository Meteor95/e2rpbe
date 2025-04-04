import { db } from "@database/connection";
import { eds_siak_coa } from "@database/schema";
import { sql, eq, and, ne } from "drizzle-orm";
import { eds_siak_entri_jurnal, eds_siak_entri_jurnalitem } from "@database/schema";

export class CoaService {
    static async getAllCoa(data: {
        kode_unik_member: string;
        kode_perusahaan: string;
    }) {
        const query = sql`
        WITH RECURSIVE AccountHierarchy AS (
            SELECT 
                id, 
                kode_coa_group, 
                parent_id, 
                nama_coa_group, 
                default_input, 
                jenis_akun,
                0::NUMERIC AS balance,
                saldo_awal_dc,
                is_delete,
                0 AS level,
                kas_bank,
                kode_perusahaan,
                kode_unik_member
            FROM eds_siak_coa
            WHERE 
                parent_id = 0 AND 
                kode_perusahaan = ${data.kode_perusahaan} AND 
                kode_unik_member = ${data.kode_unik_member}
            UNION ALL
            SELECT 
                a.id,
                a.kode_coa_group,
                a.parent_id,
                a.nama_coa_group,
                a.default_input,
                a.jenis_akun,
                a.balance,
                a.saldo_awal_dc,
                a.is_delete,
                ah.level + 1,
                a.kas_bank,
                a.kode_perusahaan,
                a.kode_unik_member
            FROM eds_siak_coa a
            INNER JOIN AccountHierarchy ah ON a.parent_id = ah.id
            WHERE 
                a.kode_perusahaan = ${data.kode_perusahaan}
        )
        SELECT * FROM AccountHierarchy
        ORDER BY kode_coa_group ASC;
        `;
        const result = await db.execute(query);
        return result.rows;
    }

    static async deleteCOA(data: {
        idCOA: number;
        kode_unik_member: string;
        kode_perusahaan: string;
        force_delete: boolean;
    }) {
        /* check if coa have children */
        const coaHavingChildren = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(eds_siak_coa)
            .where(eq(eds_siak_coa.id, data.idCOA));
        if (coaHavingChildren[0].count > 0) {
            return 100;
        }
        /* check if coa have journal */
        const journalCount = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(eds_siak_entri_jurnalitem)
            .innerJoin(
                eds_siak_entri_jurnal,
                eq(eds_siak_entri_jurnalitem.entri_jurnal_id, eds_siak_entri_jurnal.id)
            )
            .where(
                and(
                    eq(eds_siak_entri_jurnalitem.ledger_id, data.idCOA),
                    eq(eds_siak_entri_jurnal.kode_unik_member, data.kode_unik_member)
                )
            );
        if (journalCount[0].count > 0) {
            return 101;
        }
        /* boom now you can delete coa peacefully*/
        const deleteCOA = data.force_delete 
        ? db.delete(eds_siak_coa).where(eq(eds_siak_coa.id, data.idCOA)) 
        : db.update(eds_siak_coa).set({ deleted_at: new Date() }).where(eq(eds_siak_coa.id, data.idCOA));
        const result = await deleteCOA;
        return result;   
    }

    static async formatCOA(data: {
        idCOA: number;
        kode_unik_member: string;
        kode_perusahaan: string;
        jenis_akun: string;
    }) {
        let kodeCoaGroup = ""
        const codeCoaGroup = await db
        .select({ kode_coa_group: eds_siak_coa.kode_coa_group })
        .from(eds_siak_coa)
        .where(
            and(
                eq(eds_siak_coa.id, data.idCOA),
                eq(eds_siak_coa.jenis_akun, 'GRUP'),
                eq(eds_siak_coa.kode_unik_member, data.kode_unik_member),
                eq(eds_siak_coa.kode_perusahaan, data.kode_perusahaan)
            )
        );
        if (data.idCOA > 0) {
            kodeCoaGroup = codeCoaGroup[0].kode_coa_group;
        }
        const dataQuery = await db
        .select()
        .from(eds_siak_coa)
        .where(
            and(
                ne(eds_siak_coa.id, data.idCOA),
                eq(eds_siak_coa.parent_id, data.idCOA),
                eq(eds_siak_coa.jenis_akun, data.jenis_akun),
                eq(eds_siak_coa.kode_coa_group, kodeCoaGroup),
                eq(eds_siak_coa.kode_unik_member, data.kode_unik_member),
                eq(eds_siak_coa.kode_perusahaan, data.kode_perusahaan)
            )
        );
        let kodeCoaBaru = "";
        if (dataQuery.length > 0) {
            const lastItem = dataQuery[dataQuery.length - 1];
            const lastCode = lastItem.kode_coa_group;
            const codeParts = lastCode.split('-');
            let newIndex = parseInt(codeParts[codeParts.length - 1]) + 1;
            if (data.jenis_akun === "GRUP") {
                kodeCoaBaru = `${kodeCoaGroup}-${newIndex.toString().padStart(2, '0')}`;
            } else {
                kodeCoaBaru = `${kodeCoaGroup}-${newIndex.toString().padStart(6, '0')}`;
            }
        } else {
            if (data.jenis_akun === "GRUP") {
                kodeCoaBaru = `${kodeCoaGroup}-01`;
            } else {
                kodeCoaBaru = `${kodeCoaGroup}-000001`;
            }
        }
        return kodeCoaBaru;
    }

    static async InsertCoa(data: {
        parent_id: number;
        kode_coa_group: string;
        nama_coa_group: string;
        defaul_tinput: string;
        jenis_akun: string;
        balance: number;
        saldo_awal_dc: number;
        kas_bank: number;
        keterangan: string;
        is_delete: number;
        kode_unik_member: string;
        kode_perusahaan: string;
    }) {
        const result = await db.execute(`
            INSERT INTO eds_siak_coa (
                parent_id, kode_coa_group, nama_coa_group, defaul_tinput, 
                jenis_akun, balance, saldo_awal_dc, kas_bank, 
                keterangan, is_delete, kode_unik_member, kode_perusahaan, created_at
            ) VALUES (
                ${data.parent_id}, ${data.kode_coa_group}, ${data.nama_coa_group}, ${data.defaul_tinput}, 
                ${data.jenis_akun}, ${data.balance}, ${data.saldo_awal_dc}, ${data.kas_bank}, 
                ${data.keterangan}, ${data.is_delete}, ${data.kode_unik_member}, ${data.kode_perusahaan}, datetime('now')
            ) RETURNING id, kode_coa_group, nama_coa_group;
        `);
        return result;
    }
}