import { Hono } from 'hono'
import coaRoutes from "./routes/coa-routes";
import authRoutes from "./routes/auth-routes";
import docsRoutes from "./routes/docs-routes";

const app = new Hono();
app.route('/docs', docsRoutes)
app.route('/siak', coaRoutes)
app.route('/auth', authRoutes)
app.get('/', (c) => {
    return c.html('Server REST API sudah berjalan.<br>Hallo semua, ngapain kamu disini. Disini tidak ada apa apa!')
})
export default app;