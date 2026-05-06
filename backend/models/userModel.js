import { query } from '../config/db';

/**
 * Cari user berdasarkan email (termasuk data profil).
 * @param {string} email
 */
const findByEmail = async (email) => {
    const result = await query(
        `SELECT u.user_id, u.email, u.password, u.role, u.status, u.created_at,
                p.nama, p.no_hp
         FROM "user" u
         LEFT JOIN profil_penyewa p ON u.user_id = p.user_id
         WHERE u.email = $1`,
        [email]
    );
    return result.rows[0] || null;
};

/**
 * Cari user berdasarkan ID (termasuk data profil).
 * @param {number} userId
 */
const findById = async (userId) => {
    const result = await query(
        `SELECT u.user_id, u.email, u.role, u.status, u.created_at,
                p.profil_id, p.nama, p.no_hp
         FROM "user" u
         LEFT JOIN profil_penyewa p ON u.user_id = p.user_id
         WHERE u.user_id = $1`,
        [userId]
    );
    return result.rows[0] || null;
};

/**
 * Buat user baru (dalam transaksi).
 * @param {import('pg').PoolClient} client
 * @param {{ email: string, hashedPassword: string }} data
 */
const createUser = async (client, { email, hashedPassword }) => {
    const result = await client.query(
        `INSERT INTO "user" (email, password, role, status)
         VALUES ($1, $2, 'penyewa', 'aktif')
         RETURNING user_id, email, role`,
        [email, hashedPassword]
    );
    return result.rows[0];
};

/**
 * Buat profil penyewa (dalam transaksi).
 * @param {import('pg').PoolClient} client
 * @param {{ userId: number, nama: string, noHp?: string }} data
 */
const createProfile = async (client, { userId, nama, noHp }) => {
    const result = await client.query(
        `INSERT INTO profil_penyewa (user_id, nama, no_hp)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, nama, noHp || null]
    );
    return result.rows[0];
};

export default { findByEmail, findById, createUser, createProfile };
