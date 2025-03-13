import { db, logErrorToDatabase } from "@utils/db";

export async function getAllCoa(data: { 
    kode_unik_member: string;
    kode_perusahaan: string
}) {
    try {
        const result = await db`SELECT * FROM eds_siak_coa WHERE kode_perusahaan = ${data.kode_perusahaan} AND kode_unik_member = ${data.kode_unik_member}`;
        return result;
    } catch (error) {
        await logErrorToDatabase(error, '/siak/coa');
        return false;
    }
}

export async function InsertCoa(data: {
    parent_id: number;
    kode_coa_group: string;
    nama_coa_group: string;
    defaul_tinput: string;
    jenis_akun: string;
    saldo_awal: number;
    saldo_awal_dc: string;
    kas_bank: number;
    keterangan: string;
    is_delete: number;
    kode_unik_member: string;
    kode_perusahaan: string;
}) {
    try {
        const result = await db`
            INSERT INTO eds_siak_coa (
                parent_id, kode_coa_group, nama_coa_group, defaul_tinput, 
                jenis_akun, saldo_awal, saldo_awal_dc, kas_bank, 
                keterangan, is_delete, kode_unik_member, kode_perusahaan
            ) VALUES (
                ${data.parent_id}, ${data.kode_coa_group}, ${data.nama_coa_group}, ${data.defaul_tinput}, 
                ${data.jenis_akun}, ${data.saldo_awal}, ${data.saldo_awal_dc}, ${data.kas_bank}, 
                ${data.keterangan}, ${data.is_delete}, ${data.kode_unik_member}, ${data.kode_perusahaan}
            ) RETURNING id, kode_coa_group, nama_coa_group;
        `;
        return result[0];
    } catch (error) {
        await logErrorToDatabase(error, "/siak/coa"); 
        return false;
    }
}