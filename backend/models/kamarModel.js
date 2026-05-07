import db from '../config/db.js';

export const findAll = async () => {
    const result = await db.query(
        `SELECT k.*, t.nama_tipe, t.harga_bulan
         FROM kamar k
         JOIN tipe_kamar t ON k.tipe_id = t.tipe_id
         ORDER BY k.nomor_kamar ASC`
    );
    return result.rows;
};

export const findById = async (id) => {
    const result = await db.query(
        `SELECT k.*, t.nama_tipe, t.harga_bulan, t.fasilitas
         FROM kamar k
         JOIN tipe_kamar t ON k.tipe_id = t.tipe_id
         WHERE k.kamar_id = $1`,
        [id]
    );
    return result.rows[0] || null;
};

export const create = async ({ tipe_id, nomor_kamar, lantai, status, foto_kamar }) => {
    const result = await db.query(
        `INSERT INTO kamar (tipe_id, nomor_kamar, lantai, status, foto_kamar)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [tipe_id, nomor_kamar, lantai, status, foto_kamar]
    );
    return result.rows[0];
};

export const update = async (id, { tipe_id, nomor_kamar, lantai, status, foto_kamar }) => {
    const result = await db.query(
        `UPDATE kamar
         SET tipe_id = $1, nomor_kamar = $2, lantai = $3, status = $4, foto_kamar = $5
         WHERE kamar_id = $6
         RETURNING *`,
        [tipe_id, nomor_kamar, lantai, status, foto_kamar, id]
    );
    return result.rows[0] || null;
};

export const remove = async (id) => {
    await db.query('DELETE FROM kamar WHERE kamar_id = $1', [id]);
};

export default { findAll, findById, create, update, remove };
