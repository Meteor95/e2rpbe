import { Hono } from "hono";
import { swaggerUI } from '@hono/swagger-ui'

const docsRoutes = new Hono();
export default docsRoutes;