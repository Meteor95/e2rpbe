import { serve } from "bun";
import app from "../src/app";

serve({
    fetch: app.fetch,
    port: 12101,
});
