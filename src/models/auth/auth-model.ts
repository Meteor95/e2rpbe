import { db } from "@database/connection";
import { eds_users } from "@database/schema";
import { eq,or } from "drizzle-orm";

export async function processLogin(data: { 
    username:string,
    password:string,
    device_id: string;
    login_from: string;
}) {
    const resultUser = await db.select()
        .from(eds_users)
        .where(eq(eds_users.username, data.username));
    const isMatch = await Bun.password.verify(data.password, resultUser[0].password);
    if (!isMatch) {
        return false;
    }
    return resultUser[0]; 
}
export async function processRegister(data: { 
    uuidv7: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    role: number;
    registration_number: string;
    status: boolean;
    max_allowed_login: number;
    created_at: Date;
}) {
    const resultUser = await db.select()
    .from(eds_users)
    .where(
        or(
            eq(eds_users.username, data.username), 
            eq(eds_users.email, data.email),
            eq(eds_users.registration_number, data.registration_number)
        )
    ).limit(1);
    if (resultUser.length > 0) {
        return {
            success: false,
            username: resultUser[0].username,
            email: resultUser[0].email,
            registration_number: resultUser[0].registration_number,
        };
    }
    const result = await db.insert(eds_users).values({
        uuid: data.uuidv7,
        email: data.email,
        phone: data.phone,
        username: data.username,
        password: data.password, 
        role: data.role,
        registration_number: data.registration_number,
        status: data.status,
        max_allowed_login: data.max_allowed_login,
        created_at: data.created_at
    }).returning({ id: eds_users.id, username: eds_users.username });
    
    return result;
}