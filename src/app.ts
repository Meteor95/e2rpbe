import { Hono } from 'hono'
import coaRoutes from "./routes/coa-routes";

const app = new Hono();
app.route('/siak', coaRoutes)
app.get('/', (c) => {
    return c.html('Server REST API sudah berjalan.<br>Hallo semua, ngapain kamu disini. Disini tidak ada apa apa!')
})
export default app;