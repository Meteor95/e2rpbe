import { db } from "@database/connection";
import { eds_siak_coa } from "@database/schema";
import { sql, eq } from "drizzle-orm";

export async function getAllCoa(data: {
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
            a.kode_perusahaana = ${data.kode_perusahaan}
    )
    SELECT * FROM AccountHierarchy
    ORDER BY kode_coa_group ASC;
`;
const result = await db.execute(query);
return result.rows;
}
export async function deleteCOA(data: {
    idCOA: number;
    kode_unik_member: string;
    kode_perusahaan: string;
}) {
    const coaHavingChildren = await db
        .select({ count: sql<number>`COUNT(*) as ADADATA` })
        .from(eds_siak_coa)
        .where(eq(eds_siak_coa.id, data.idCOA));
    if (coaHavingChildren[0].count > 0) {
        return 0; // Has children
    } else {
        
    }
}
export async function InsertCoa(data: {
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
    try {
        const result = await db.execute(`
            INSERT INTO eds_siak_coa (
                parent_id, kode_coa_group, nama_coa_group, defaul_tinput, 
                jenis_akun, balance, saldo_awal_dc, kas_bank, 
                keterangan, is_delete, kode_unik_member, kode_perusahaan
            ) VALUES (
                ${data.parent_id}, ${data.kode_coa_group}, ${data.nama_coa_group}, ${data.defaul_tinput}, 
                ${data.jenis_akun}, ${data.balance}, ${data.saldo_awal_dc}, ${data.kas_bank}, 
                ${data.keterangan}, ${data.is_delete}, ${data.kode_unik_member}, ${data.kode_perusahaan}
            ) RETURNING id, kode_coa_group, nama_coa_group;
        `);
        return result;
    } catch (error) {
        return false;
    }
}