import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';

export const register = async ({ email, password, nama, no_hp }) => {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) throw new AppError('Email sudah terdaftar.', 400);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.createUser(client, { email, hashedPassword });
        await userModel.createProfile(client, { userId: newUser.user_id, nama, noHp: no_hp });
        await client.query('COMMIT');
        return { user_id: newUser.user_id, email: newUser.email, role: newUser.role };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const login = async ({ email, password }) => {
    const user = await userModel.findByEmail(email);
    if (!user) throw new AppError('Email atau password salah.', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Email atau password salah.', 401);

    if (user.status !== 'aktif') throw new AppError('Akun Anda dinonaktifkan.', 403);

    return { user_id: user.user_id, email: user.email, role: user.role, nama: user.nama };
};

export const getMe = async (id) => {
    const user = await userModel.findById(id);
    if (!user) throw new AppError('User tidak ditemukan.', 404);
    return user;
};

export default { register, login, getMe };
