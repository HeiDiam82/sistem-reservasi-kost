import { query } from '../config/db';

const findAll = async () => {
    const result = await query(
        `SELECT * FROM tipe_kamar ORDER BY created_at DESC`
    );
    return result.rows;
};

const findById = async (id) => {
    const result = await query(
        `SELECT * FROM tipe_kamar WHERE tipe_id = $1`,
        [id]
    );
    return result.rows[0] || null;
};

const create = async ({ nama_tipe, harga_bulan, fasilitas }) => {
    const result = await query(
        `INSERT INTO tipe_kamar (nama_tipe, harga_bulan, fasilitas)
         VALUES ($1, $2, $3) RETURNING *`,
        [nama_tipe, harga_bulan, fasilitas || null]
    );
    return result.rows[0];
};

const update = async (id, { nama_tipe, harga_bulan, fasilitas }) => {
    const result = await query(
        `UPDATE tipe_kamar
         SET nama_tipe    = COALESCE($1, nama_tipe),
             harga_bulan  = COALESCE($2, harga_bulan),
             fasilitas    = COALESCE($3, fasilitas)
         WHERE tipe_id = $4
         RETURNING *`,
        [nama_tipe, harga_bulan, fasilitas, id]
    );
    return result.rows[0] || null;
};

const remove = async (id) => {
    const result = await query(
        `DELETE FROM tipe_kamar WHERE tipe_id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0] || null;
};

export default { findAll, findById, create, update, remove };
