import db, { query } from '../config/db';

const findAll = async () => {
    const result = await query(
        `SELECT k.*, t.nama_tipe, t.harga_bulan, t.fasilitas
         FROM kamar k
         LEFT JOIN tipe_kamar t ON k.tipe_id = t.tipe_id
         ORDER BY k.nomor_kamar ASC`
    );
    return result.rows;
};

const findById = async (id) => {
    const result = await query(
        `SELECT k.*, t.nama_tipe, t.harga_bulan, t.fasilitas
         FROM kamar k
         LEFT JOIN tipe_kamar t ON k.tipe_id = t.tipe_id
         WHERE k.kamar_id = $1`,
        [id]
    );
    return result.rows[0] || null;
};

const findByNomorKamar = async (nomor_kamar) => {
    const result = await query(
        `SELECT kamar_id FROM kamar WHERE nomor_kamar = $1`,
        [nomor_kamar]
    );
    return result.rows[0] || null;
};

const create = async ({ tipe_id, nomor_kamar, lantai, foto_kamar }) => {
    const result = await query(
        `INSERT INTO kamar (tipe_id, nomor_kamar, lantai, foto_kamar, status)
         VALUES ($1, $2, $3, $4, 'tersedia') RETURNING *`,
        [tipe_id, nomor_kamar, lantai || null, foto_kamar || null]
    );
    return result.rows[0];
};

const update = async (id, { tipe_id, nomor_kamar, lantai, status, foto_kamar }) => {
    const result = await query(
        `UPDATE kamar
         SET tipe_id     = COALESCE($1, tipe_id),
             nomor_kamar = COALESCE($2, nomor_kamar),
             lantai      = COALESCE($3, lantai),
             status      = COALESCE($4, status),
             foto_kamar  = COALESCE($5, foto_kamar)
         WHERE kamar_id = $6
         RETURNING *`,
        [tipe_id, nomor_kamar, lantai, status, foto_kamar, id]
    );
    return result.rows[0] || null;
};

const updateStatus = async (id, status, client = null) => {
    const executor = client || db;
    const result = await executor.query(
        `UPDATE kamar SET status = $1 WHERE kamar_id = $2 RETURNING *`,
        [status, id]
    );
    return result.rows[0] || null;
};

const remove = async (id) => {
    const result = await query(
        `DELETE FROM kamar WHERE kamar_id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0] || null;
};

/** Cek apakah ada reservasi aktif untuk kamar ini */
const hasActiveReservasi = async (kamarId) => {
    const result = await query(
        `SELECT reservasi_id FROM reservasi
         WHERE kamar_id = $1 AND status IN ('menunggu', 'dikonfirmasi', 'berjalan')`,
        [kamarId]
    );
    return result.rows.length > 0;
};

export default { findAll, findById, findByNomorKamar, create, update, updateStatus, remove, hasActiveReservasi };
