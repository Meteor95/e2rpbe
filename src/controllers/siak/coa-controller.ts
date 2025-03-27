import { Context } from 'hono'
import { getAllCoa, InsertCoa } from "@models/siak/coa-model";
import { handleError } from "@helpers/handleError";

interface CoaItem {
    id: number;
    parent_id: number;
    kode_coa_group: string;
    nama_coa_group: string;
    children?: CoaItem[];
}

function buildTree(data: CoaItem[], parentId: number): CoaItem[] {
    const tree: CoaItem[] = [];
    data.forEach((item) => {
        if (Number(item.parent_id) === parentId) {
            const children = buildTree(data, item.id);
            tree.push({
                ...item,
                children: children.length > 0 ? children : undefined
            });
        }
    });
    return tree;
}

export const getCoa = async (c: Context) => {
    const { kode_unik_member, kode_perusahaan } = c.req.query();
    try {
        const coa = await getAllCoa({ kode_unik_member, kode_perusahaan });
        if (!Array.isArray(coa)) {
            throw new Error("Invalid COA data format. The datas must be an array.");
        }
        const tree = buildTree(coa, 0);
        return c.json({
            success: true,
            message: "List of COA with Kode Perusahaan: " + kode_perusahaan + " dan Kode Unik Member: " + kode_unik_member + " ",
            data: tree,
        },200);
    } catch (e) {
        const error = e as AggregateError;
        return handleError(c, error, "Something Error when performing the getCOA reading process. Please contact the administrator.");
    }
};
export const deleteCodeCOA = async (c: Context) => {
    const { idCOA, kode_unik_member, kode_perusahaan } = c.req.query();
    try {
        const coa = await deleteCOA({ idCOA, kode_unik_member, kode_perusahaan });
    } catch (e) {
        const error = e as AggregateError;
        return handleError(c, error, "Something Error when deleting COA with paramter . Please contact the administrator.");
    }
}
export const createCoa = async (c: Context) => {
    try {
        const body = await c.req.json();
        const data_return_insert = await InsertCoa(body);
        return c.json({ message: "COA berhasil ditambahkan", data: data_return_insert }, 200);
    } catch (error) { 
        return c.json({ error: "Terjadi kesalahan. Silahkan cek pada tabel error log" }, 500);
    }
};