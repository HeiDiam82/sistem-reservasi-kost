import db from '../config/db.js';

export const findAll = async () => {
    const result = await db.query(
        `SELECT pb.*,
                r.tanggal_masuk, r.tanggal_keluar,
                r.total_harga AS total_reservasi, r.status AS status_reservasi,
                p.nama AS nama_penyewa, u.email,
                k.nomor_kamar, t.nama_tipe
         FROM pembayaran pb
         JOIN reservasi r ON pb.reservasi_id = r.reservasi_id
         JOIN users u ON r.user_id = u.user_id
         LEFT JOIN profil_penyewa p ON r.user_id = p.user_id
         JOIN kamar k ON r.kamar_id = k.kamar_id
         LEFT JOIN tipe_kamar t ON k.tipe_id = t.tipe_id
         ORDER BY pb.tanggal_bayar DESC`
    );
    return result.rows;
};

export const findAllByUser = async (userId) => {
    const result = await db.query(
        `SELECT pb.*,
                r.tanggal_masuk, r.tanggal_keluar,
                r.total_harga AS total_reservasi, r.status AS status_reservasi,
                k.nomor_kamar, t.nama_tipe
         FROM pembayaran pb
         JOIN reservasi r ON pb.reservasi_id = r.reservasi_id
         JOIN kamar k ON r.kamar_id = k.kamar_id
         LEFT JOIN tipe_kamar t ON k.tipe_id = t.tipe_id
         WHERE r.user_id = $1
         ORDER BY pb.tanggal_bayar DESC`,
        [userId]
    );
    return result.rows;
};

export const findById = async (id) => {
    const result = await db.query(
        `SELECT pb.*, r.user_id, r.kamar_id, r.reservasi_id, r.status AS status_reservasi
         FROM pembayaran pb
         JOIN reservasi r ON pb.reservasi_id = r.reservasi_id
         WHERE pb.pembayaran_id = $1`,
        [id]
    );
    return result.rows[0] || null;
};

export const create = async ({ reservasi_id, jumlah_bayar, metode_bayar }) => {
    const result = await db.query(
        `INSERT INTO pembayaran (reservasi_id, jumlah_bayar, metode_bayar, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING *`,
        [reservasi_id, jumlah_bayar, metode_bayar]
    );
    return result.rows[0];
};

export const updateStatus = async (client, id, status) => {
    const result = await client.query(
        `UPDATE pembayaran SET status = $1 WHERE pembayaran_id = $2 RETURNING *`,
        [status, id]
    );
    return result.rows[0] || null;
};

export default { findAll, findAllByUser, findById, create, updateStatus };
