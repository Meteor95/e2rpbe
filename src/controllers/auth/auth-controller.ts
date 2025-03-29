import { z } from "zod";
import { randomUUIDv7 } from "bun";
import { Context } from 'hono';
import { decode, sign, verify } from 'hono/jwt'
import { handleError } from '@helpers/handleError';
import { processLogin, processRegister } from '@models/auth/auth-model';

export const login = async (c: Context) => {
    const schema = z.object({
        username: z.string(),
        password: z.string().min(6),
        device_id: z.string().min(12),
        login_from: z.string(),
    });
    const body = await c.req.json();
    const data = schema.parse(body);
    try{
        const resultLogin = await processLogin({
            username: data.username,
            password: data.password,
            device_id: data.device_id,
            login_from: data.login_from,
         });
        return c.json({
            success: true,
            message: `Process login success with username ${data.username}.`,
        },200);
    }catch (e) {
        const error = e as AggregateError;
        return handleError(c, error, `Something Error when users do Login with username ${data.username}. Please contact the administrator.`);
    }
};
export const register = async (c: Context) => {
    const schema = z.object({
        email: z.string().email(),
        phone: z.string().min(10),
        username: z.string().min(3),
        password: z.string().min(6),
        //role: z.number().int().positive(),
        registration_number: z.string().min(5)
    });
    try {
        const body = await c.req.parseBody();
        const data = schema.parse(body);   
        const resultRegister = await processRegister({
            uuidv7: randomUUIDv7(),
            email: data.email,
            phone: data.phone,
            username: data.username,
            password: data.password,
            role: 0,
            registration_number: data.registration_number,
            status: false,
            max_allowed_login: 5,
            created_at: new Date(),
        });
        let messages = `Registration successful for username : ${data.username}`, is_success = true, data_result = resultRegister;
        if ("success" in resultRegister && !resultRegister.success) {
            messages = `Registration failed because username or email or registration number already exists.`;
            is_success = false;
            data_result = resultRegister;
        }
        return c.json({
            success: is_success,
            message: messages,
            data: data_result,
        },200);
    } catch (e) {
        const error = e as Error;
        return handleError(c, error, "Registration failed");
    }
};