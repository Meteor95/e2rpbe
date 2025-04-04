import { z } from "zod";
import { env, randomUUIDv7 } from "bun";
import { Context } from 'hono';
import { handleError } from '@helpers/handleError';
import { AuthService } from '@services/auth/auth-services';
import RSACryptoHelper from '@helpers/cryptoString';

export const login = async (c: Context) => {
    const schema = z.object({
        username: z.string(),
        password: z.string().min(6),
        device_id: z.string().min(12),
        access_form: z.string(),
    });
    try{
        const body = await c.req.parseBody();
        const data = schema.parse(body);   
        const resultLogin = await AuthService.processLogin({
            username: data.username,
            password: data.password,
            device_id: data.device_id,
            access_form: data.access_form,
         });
        let messages = `Login successful for username : ${data.username}`, is_success = true;
        if(resultLogin == 0) {
            messages = `Login failed because username or password is incorrect.`;
            is_success = false;
        }
        if(resultLogin == -1) {
            messages = `Login failed because maximum login attempts has reached. Please logout in other device.`;
            is_success = false;
        }
        if(resultLogin == -2) {
            messages = `Login failed because account is not active or banned. Please contact the administrator.`;
            is_success = false;
        }
        const response = new Response(
            JSON.stringify({
                success: is_success,
                message: messages,
                data: {
                    username: data.username,
                    device_id: data.device_id,
                    data: resultLogin,
                },
            }),
            {
                status: is_success ? 200 : 401,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        
        const firstWord = data.access_form.split("_")[0];
        if (firstWord === "web" && typeof resultLogin !== "number" && resultLogin.token && resultLogin.uuid) {
            const RSACryptoHelperresultLogin = await RSACryptoHelper.encryptToken(resultLogin.token);
            const cookieHeader = [
                `token_akses=${btoa(RSACryptoHelperresultLogin)}`,
                'Path=/',
                env.COOKIE_IS_HTTP_ONLY === "true" ? 'HttpOnly' : '',
                `SameSite=${env.COOKIE_SAME_SITE}`,
                env.COOKIE_IS_SECURE === "true" ? 'Secure' : '',
            ].filter(Boolean).join('; ');
            const cookieHeaderUUID = [
                `uuid=${resultLogin.uuid}`,
                'Path=/',
                `SameSite=${env.COOKIE_SAME_SITE}`,
                env.COOKIE_IS_SECURE === "true"? 'Secure' : '',
            ].filter(Boolean).join('; ');
            response.headers.append('Set-Cookie', cookieHeader)
            response.headers.append('Set-Cookie', cookieHeaderUUID);   
        }
        return response;
    }catch (e) {
        const error = e as AggregateError;
        return handleError(c, error, `Something error when users do Login. Please contact the administrator.`);
    }
};
export const register = async (c: Context) => {
    const schema = z.object({
        email: z.string().email(),
        phone: z.string().min(10),
        username: z.string().min(3),
        password: z.string().min(6),
        role: z.number().int().positive(),
        registration_number: z.string().min(5)
    });
    try {
        const body = await c.req.parseBody();
        const data = schema.parse(body);   
        const resultRegister = await AuthService.processRegister({
            uuidv7: randomUUIDv7(),
            email: data.email,
            phone: data.phone,
            username: data.username,
            password: data.password,
            role: data.role,
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
export const decryptToken = async (c: Context) => {
    const schema = z.object({
        token_cookie: z.string().min(10),
        uuid: z.string().min(10),
    });
    try {
        const body = await c.req.json();
        const data = schema.parse(body);
        const resultDecrypt = await RSACryptoHelper.decryptToken(data.token_cookie);
        const tokenFindInRedis = await AuthService.checkTokenInRedis(data.uuid, resultDecrypt);
        let is_success = true, message = "Decrypt token successful, enjoy the meal";
        if (!tokenFindInRedis){
            is_success = false;
            message = "Decrypt token failed. Your token not found in our database, please check it.";
        }
        return c.json({
            success: is_success,
            message: message,
        },tokenFindInRedis? 200 : 401);
    } catch (e) {
        const error = e as Error;
        return handleError(c, error, "Decrypt token failed, please check your public or private key and also check your token to, try again later. if still error, please contact the administrator.");
    }
}