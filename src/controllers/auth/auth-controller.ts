import { Context } from 'hono';
import { z } from "zod";
import { logErrorToDatabase } from '@utils/db';

export const login = async (c: Context) => {
    const schema = z.object({
        username: z.string(),
        password: z.string(),
        token: z.string()
    });

    try{
        
    }catch (error) {
        await logErrorToDatabase(error, "/siak/coa"); 
        return c.json({ error: "Terjadi kesalahan. Silahkan cek pada tabel error log" }, 500);
    }
};
export const register = async (c: Context) => {
    const schema = z.object({
        uuid: z.string(),
        username: z.string(),
        password: z.string(),
        role:z.number(),
        registration_number: z.string(),
    });
    try{
        const body = await c.req.json();
        const data = schema.parse(body);
        const passwordHash = await Bun.password.hash(data.password, {
            algorithm: "bcrypt",
            cost: 12,
        });
        
    }catch (error) {
        await logErrorToDatabase(error, "/siak/coa"); 
        return c.json({ error: "Terjadi kesalahan. Silahkan cek pada tabel error log" }, 500);
    }
};