import { pool } from '../config/db';
import { findAll, findAllByUser, create as _create, findById, updateStatus as _updateStatus } from '../models/pembayaranModel';
import { findById as _findById, updateStatus as __updateStatus } from '../models/reservasiModel';
import { create as __create } from '../models/notifikasiModel';
import AppError from '../utils/AppError';

const ALLOWED_STATUS = ['pending', 'sukses', 'gagal'];

const getAll = async (user) => {
    if (user.role === 'admin') return findAll();
    return findAllByUser(user.id);
};

const create = async ({ reservasi_id, jumlah_bayar, metode_bayar }, userId) => {
    if (!reservasi_id || !jumlah_bayar || !metode_bayar) {
        throw new AppError('Semua field wajib diisi.', 400);
    }

    // Pastikan reservasi milik user ini
    const reservasi = await _findById(reservasi_id);
    if (!reservasi) throw new AppError('Reservasi tidak ditemukan.', 404);
    if (reservasi.user_id !== userId) throw new AppError('Akses ditolak.', 403);
    if (!['menunggu', 'dikonfirmasi'].includes(reservasi.status)) {
        throw new AppError('Reservasi tidak dalam status yang bisa dibayar.', 400);
    }

    return _create({ reservasi_id, jumlah_bayar, metode_bayar });
};

const updateStatus = async (id, status) => {
    if (!status || !ALLOWED_STATUS.includes(status)) {
        throw new AppError(`Status tidak valid. Pilih dari: ${ALLOWED_STATUS.join(', ')}`, 400);
    }

    const pembayaran = await findById(id);
    if (!pembayaran) throw new AppError('Pembayaran tidak ditemukan.', 404);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await _updateStatus(client, id, status);

        if (status === 'sukses') {
            await __updateStatus(client, pembayaran.reservasi_id, 'berjalan');
            await __create(client, {
                user_id: pembayaran.user_id,
                judul:   'Pembayaran Dikonfirmasi',
                pesan:   'Pembayaran Anda telah dikonfirmasi. Reservasi Anda sekarang berstatus Berjalan.'
            });
        } else if (status === 'gagal') {
            await __create(client, {
                user_id: pembayaran.user_id,
                judul:   'Pembayaran Ditolak',
                pesan:   'Pembayaran Anda ditolak oleh admin. Silakan hubungi admin untuk informasi lebih lanjut.'
            });
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export default { getAll, create, updateStatus };
