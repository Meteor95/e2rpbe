import { Context } from "hono";

export const handleError = (c: Context, error: any, message = "Something went wrong.") => {
    return c.json({
        success: false,
        message,
        error: error.message,
    }, 500);
};

