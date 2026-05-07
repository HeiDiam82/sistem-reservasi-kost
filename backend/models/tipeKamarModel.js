import db from '../config/db.js';

export const findAll = async () => {
    const result = await db.query('SELECT * FROM tipe_kamar ORDER BY nama_tipe ASC');
    return result.rows;
};

export const findById = async (id) => {
    const result = await db.query('SELECT * FROM tipe_kamar WHERE tipe_id = $1', [id]);
    return result.rows[0] || null;
};

export const create = async ({ nama_tipe, harga_bulan, fasilitas }) => {
    const result = await db.query(
        'INSERT INTO tipe_kamar (nama_tipe, harga_bulan, fasilitas) VALUES ($1, $2, $3) RETURNING *',
        [nama_tipe, harga_bulan, fasilitas]
    );
    return result.rows[0];
};

export const update = async (id, { nama_tipe, harga_bulan, fasilitas }) => {
    const result = await db.query(
        'UPDATE tipe_kamar SET nama_tipe = $1, harga_bulan = $2, fasilitas = $3 WHERE tipe_id = $4 RETURNING *',
        [nama_tipe, harga_bulan, fasilitas, id]
    );
    return result.rows[0] || null;
};

export const remove = async (id) => {
    await db.query('DELETE FROM tipe_kamar WHERE tipe_id = $1', [id]);
};

export default { findAll, findById, create, update, remove };
