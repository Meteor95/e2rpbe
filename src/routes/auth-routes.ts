import { Hono } from "hono";
import { register, login, decryptToken } from "@controllers/auth/auth-controller";

const authRoutes = new Hono();
authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.post("/rsadecrypt", decryptToken);
export default authRoutes;