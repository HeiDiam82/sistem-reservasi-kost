import { hash, compare } from 'bcrypt';
import { pool } from '../config/db';
import { findByEmail, createUser, createProfile, findById } from '../models/userModel';
import AppError from '../utils/AppError';

const SALT_ROUNDS = 10;

/**
 * Registrasi penyewa baru.
 * Menggunakan transaksi karena menulis ke 2 tabel sekaligus.
 */
const register = async ({ email, password, nama, no_hp }) => {
    if (!email || !password || !nama) {
        throw new AppError('Email, password, dan nama wajib diisi.', 400);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const existing = await findByEmail(email);
        if (existing) throw new AppError('Email sudah terdaftar.', 400);

        const hashedPassword = await hash(password, SALT_ROUNDS);
        const newUser = await createUser(client, { email, hashedPassword });
        await createProfile(client, { userId: newUser.user_id, nama, noHp: no_hp });

        await client.query('COMMIT');
        return { user_id: newUser.user_id, email: newUser.email, role: newUser.role };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

/**
 * Login: verifikasi kredensial dan kembalikan data user.
 */
const login = async ({ email, password }) => {
    if (!email || !password) {
        throw new AppError('Email dan password wajib diisi.', 400);
    }

    const user = await findByEmail(email);
    if (!user) throw new AppError('Email atau password salah.', 401);
    if (user.status === 'nonaktif') throw new AppError('Akun Anda telah dinonaktifkan.', 403);

    const isValid = await compare(password, user.password);
    if (!isValid) throw new AppError('Email atau password salah.', 401);

    return {
        user_id: user.user_id,
        email:   user.email,
        role:    user.role,
        nama:    user.nama
    };
};

/**
 * Ambil data user berdasarkan ID sesi.
 */
const getMe = async (userId) => {
    const user = await findById(userId);
    if (!user) throw new AppError('User tidak ditemukan.', 404);
    return user;
};

export default { register, login, getMe };
