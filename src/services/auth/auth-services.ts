import { db } from "@database/connection";
import { eds_users, eds_users_login } from "@database/schema";
import { and, eq, or, sql } from "drizzle-orm";
import redisHelper from "@helpers/redisHelper";

export class AuthService {
    static async processLogin(data: { 
        username: string;
        password: string;
        device_id: string;
        access_form: string;
    }) {
        const resultUser = await db.select()
            .from(eds_users)
            .where(
                or(
                    eq(eds_users.username, data.username),
                    eq(eds_users.email, data.username)
                )
            );
        if (resultUser.length === 0) {
            return 0;
        }
        if (!resultUser[0].status){
            return -2;
        }
        const isMatch = await Bun.password.verify(data.password, resultUser[0].password);
        if (!isMatch) {
            return 0;
        }
        const cekUserReadyLoginBefore = await db.select(
            { count: sql<number>`COUNT(*)` }
        )
           .from(eds_users_login)
           .where(
                and(
                    eq(eds_users_login.deviced_id, data.device_id),
                    eq(eds_users_login.user_id, resultUser[0].id)
                )
            ).limit(1);
        if (cekUserReadyLoginBefore[0].count == 0) {
            // check max count user can login in one time
            const resultLogin = await db.select(
                { count: sql<number>`COUNT(*)` }
            )
            .from(eds_users_login)
            .where(eq(eds_users_login.user_id, resultUser[0].id));
            if (resultLogin[0].count >= resultUser[0].max_allowed_login) {
                return -1;
            }
            // save infomation login to database for logging with transaction proccess
            await db.transaction(async (tx) => {
                await tx.insert(eds_users_login)
                .values({
                    user_id: resultUser[0].id,
                    deviced_id: data.device_id,
                    login_from: data.access_form,
                    created_at: new Date()
                });
                await redisHelper.set(resultUser[0].uuid, {
                    id: resultUser[0].id,
                    uuid: resultUser[0].uuid,
                    token: resultUser[0].token
                }, 60 * 60 * 24 * 7);
            });  
        }
        return {
            id: resultUser[0].id,
            uuid: resultUser[0].uuid,
            username: resultUser[0].username,
            token: resultUser[0].token,
        };
    }
    static async checkTokenInRedis(uuid: string, token: string) {
        const result = await redisHelper.get<{ token: string }>(uuid);
        if (result?.token === token) {
            return true;
        }
        return false;
    }
    static async processRegister(data: { 
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
            )
            .limit(1);

        if (resultUser.length > 0) {
            return {
                success: false,
                username: resultUser[0].username,
                email: resultUser[0].email,
                registration_number: resultUser[0].registration_number,
            };
        }
        const hasher = new Bun.CryptoHasher("sha256");
        hasher.update(`erakaunting_${data.uuidv7.replace(/-/g, '')}`);
        const result = await db.insert(eds_users)
            .values({
                uuid: data.uuidv7,
                email: data.email,
                phone: data.phone,
                username: data.username,
                password: data.password,
                role: data.role,
                registration_number: data.registration_number,
                status: data.status,
                max_allowed_login: data.max_allowed_login,
                token: hasher.digest("hex"),
                created_at: data.created_at
            })
            .returning({ 
                id: eds_users.id, 
                username: eds_users.username 
            });

        return result;
    }
}