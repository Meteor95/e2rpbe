import { db, logErrorToDatabase } from "@utils/db";

export async function login(data: { 
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
export async function register(data: { 
    uuid: string;
    username: string;
    password: string;
    role: Int16Array;
}) {
    try {
        const result = await db`SELECT * FROM eds_siak_coa WHERE kode_perusahaan = ${data.kode_perusahaan} AND kode_unik_member = ${data.kode_unik_member}`;
        return result;
    } catch (error) {
        await logErrorToDatabase(error, '/siak/coa');
        return false;
    }
}