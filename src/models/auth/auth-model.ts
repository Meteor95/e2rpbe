import { db } from "@database/connection";
import { eds_users } from "@database/schema/eds_users";

export async function login(data: { 
    kode_unik_member: string;
    kode_perusahaan: string
}) {

    try {
        const prepared = db.select().from(eds_users).prepare("login_process");
        const result = await prepared.execute({
            kode_perusahaan: data.kode_perusahaan,
            kode_unik_member: data.kode_unik_member
        });
        return result;
    } catch (error) {
        return false;
    }
}
export async function register(data: { 
    uuid: string;
    username: string;
    password: string;
    role: string;
    registration_number: string;
    status: string;
    created_at: Date;
}) {
    try {
        const result = await db.execute(`
            INSERT INTO eds_users (
                uuid, username, password, role, registration_number, status, created_at
            ) VALUES (
                ${data.uuid}, ${data.username}, ${data.password}, ${data.role}, ${data.registration_number}, ${data.status}, ${data.created_at}
            ) RETURNING id, username;
        `);
        return result;
    } catch (error) {
        return false;
    }
}