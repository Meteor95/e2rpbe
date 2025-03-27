import { Context } from 'hono'
import { getAllCoa, InsertCoa } from "@models/siak/coa-model";

export const getCoa = async (c: Context) => {
    try{
        const body = await c.req.json();
        const coa = await getAllCoa(body);
        return c.json({ coa });
    }catch (error) {
        return c.json({ error: "Terjadi kesalahan. Silahkan cek pada tabel error log" }, 500);
    }
};

export const createCoa = async (c: Context) => {
    try {
        const body = await c.req.json();
        const data_return_insert = await InsertCoa(body);
        return c.json({ message: "COA berhasil ditambahkan", data: data_return_insert }, 200);
    } catch (error) { 
        return c.json({ error: "Terjadi kesalahan. Silahkan cek pada tabel error log" }, 500);
    }
};