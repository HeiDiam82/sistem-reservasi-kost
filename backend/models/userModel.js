import db from '../config/db.js';

export const findByEmail = async (email) => {
    const result = await db.query(
        `SELECT u.user_id, u.email, u.password, u.role, u.status, u.created_at,
                p.nama, p.no_hp
         FROM users u
         LEFT JOIN profil_penyewa p ON u.user_id = p.user_id
         WHERE u.email = $1`,
        [email]
    );
    return result.rows[0] || null;
};

export const findById = async (userId) => {
    const result = await db.query(
        `SELECT u.user_id, u.email, u.role, u.status, u.created_at,
                p.profil_id, p.nama, p.no_hp
         FROM users u
         LEFT JOIN profil_penyewa p ON u.user_id = p.user_id
         WHERE u.user_id = $1`,
        [userId]
    );
    return result.rows[0] || null;
};

export const createUser = async (client, { email, hashedPassword }) => {
    const result = await client.query(
        `INSERT INTO users (email, password, role, status)
         VALUES ($1, $2, 'penyewa', 'aktif')
         RETURNING user_id, email, role`,
        [email, hashedPassword]
    );
    return result.rows[0];
};

export const createProfile = async (client, { userId, nama, noHp }) => {
    const result = await client.query(
        `INSERT INTO profil_penyewa (user_id, nama, no_hp)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, nama, noHp || null]
    );
    return result.rows[0];
};

export default { findByEmail, findById, createUser, createProfile };
