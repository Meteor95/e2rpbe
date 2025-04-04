import { Hono } from 'hono'
import { cors } from 'hono/cors'
import coaRoutes from "./routes/coa-routes";
import authRoutes from "./routes/auth-routes";
import docsRoutes from "./routes/docs-routes";
import { checkDatabase } from './middleware/checkDatabase';

const app = new Hono();
app.use(checkDatabase);
app.use(
    '*',
    cors({
      origin: 'http://localhost:12101', // Replace with your actual frontend URL
      credentials: true,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    })
  );
  
app.route('/docs', docsRoutes)
app.route('/siak', coaRoutes)
app.route('/auth', authRoutes)
app.get('/', (c) => {
    return c.html('Server REST API sudah berjalan.<br>Hallo semua, ngapain kamu disini. Disini tidak ada apa apa!')
})
export default app;