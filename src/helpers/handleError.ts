import { Context } from "hono";

const isJSON = (message: string) => {
    return message.trim().startsWith("{") && message.trim().endsWith("}");
};
export const handleError = (c: Context, error: any, message = "Something went wrong.") => {
    return c.json({
        success: false,
        message,
        error: isJSON(error.message) ? JSON.parse(error.message) : error.message,
    }, 500);
};

