import { Hono } from "hono";
import { swaggerUI } from '@hono/swagger-ui'
import { getCoa, createCoa } from "@controllers/siak/coa-controller";

const coaRoutes = new Hono();
coaRoutes.get("/coa_list", getCoa);
coaRoutes.post("/create_coa", createCoa);
export default coaRoutes;