import { Hono } from "hono";
import { register, login } from "@controllers/auth/auth-controller";

const authRoutes = new Hono();
authRoutes.post("/login", login);
authRoutes.post("/register", register);
export default authRoutes;