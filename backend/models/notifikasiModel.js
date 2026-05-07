import db from '../config/db.js';

export const findByUser = async (userId) => {
    const result = await db.query(
        `SELECT * FROM notifikasi
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
};

export const create = async (client, { user_id, judul, pesan }) => {
    const result = await client.query(
        `INSERT INTO notifikasi (user_id, judul, pesan)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [user_id, judul, pesan]
    );
    return result.rows[0];
};

export const markRead = async (id, userId) => {
    const result = await db.query(
        `UPDATE notifikasi
         SET is_read = TRUE
         WHERE notifikasi_id = $1 AND user_id = $2
         RETURNING *`,
        [id, userId]
    );
    return result.rows[0] || null;
};

export const markAllRead = async (userId) => {
    await db.query(
        `UPDATE notifikasi SET is_read = TRUE
         WHERE user_id = $1 AND is_read = FALSE`,
        [userId]
    );
};

export default { findByUser, create, markRead, markAllRead };
