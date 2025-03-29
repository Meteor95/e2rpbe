import { Context } from 'hono'
import { deleteCOA, formatCOA, getAllCoa, InsertCoa } from "@models/siak/coa-model";
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
        const coaData = await getAllCoa({ kode_unik_member, kode_perusahaan });
        const coa = coaData.map((item: any) => ({
            id: Number(item.id),
            parent_id: Number(item.parent_id),
            kode_coa_group: String(item.kode_coa_group),
            nama_coa_group: String(item.nama_coa_group)
        })) as CoaItem[];

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

export const getFormatCOA = async (c: Context) => {
    const { idCOA, kode_unik_member, kode_perusahaan, jenis_akun } = c.req.query();
    try {
        const result = await formatCOA({ idCOA: Number(idCOA), kode_unik_member, kode_perusahaan, jenis_akun });
        return c.json({
            success: true,
            message: "New Format COA with Kode Perusahaan: " + kode_perusahaan + " and Kode Unik Member: " + kode_unik_member,
            data: result,
        },200)
    } catch (e) {
        const error = e as AggregateError;
        return handleError(c, error, "Something Error when create new format COA in getFormatCOA function. Please contact the administrator.");
    }
}
export const deleteCodeCOA = async (c: Context) => {
    const { idCOA, kode_unik_member, kode_perusahaan } = c.req.query();
    try {
       const result = await deleteCOA({ idCOA: Number(idCOA), kode_unik_member, kode_perusahaan, force_delete: false });
       let messages = "COA has been deleted successfully and peacefully", is_success = true, data_result = result;
       if (result === 100) {
            is_success = false;
            messages = "COA have children. Please delete all children first."
            data_result = 0;
       }
       if (result === 101) {
            is_success = false;
            messages = "COA have journal. Please delete journal first."
            data_result = 0;
       }
       return c.json({
            success: is_success,
            message: messages,
            data: data_result,
        },data_result === 0 ? 400 : 200)
    } catch (e) {
        const error = e as AggregateError;
        return handleError(c, error, "Something Error when deleting COA with paramter . Please contact the administrator.");
    }
}
export const createCoa = async (c: Context) => {
    try {
        const body = await c.req.json();
        const data_return_insert = await InsertCoa(body);
        return c.json({ message: "COA added in our database successfully", data: data_return_insert }, 200);
    } catch (e) { 
        const error = e as AggregateError;
        return handleError(c, error, "Something Error when insert a new COA in createCOA function . Please contact the administrator.");
    }
};