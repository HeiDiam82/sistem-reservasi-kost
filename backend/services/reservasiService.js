import { pool } from '../config/db';
import { findAll, findAllByUser, findById, findKonflikTanggal, create as _create, updateStatus as _updateStatus } from '../models/reservasiModel';
import { findById as _findById, updateStatus as __updateStatus } from '../models/kamarModel';
import { create as __create } from '../models/notifikasiModel';
import AppError from '../utils/AppError';

/** Hitung total harga berdasarkan selisih hari → bulan (dibulatkan ke atas) */
const hitungTotalHarga = (tanggalMasuk, tanggalKeluar, hargaBulan) => {
    const diffMs   = new Date(tanggalKeluar) - new Date(tanggalMasuk);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const bulan    = Math.ceil(diffDays / 30);
    return bulan * hargaBulan;
};

const PESAN_STATUS = {
    dikonfirmasi: 'Reservasi Anda telah dikonfirmasi oleh admin. Silakan lakukan pembayaran.',
    berjalan:     'Selamat! Reservasi Anda sekarang sedang berjalan.',
    dibatalkan:   'Reservasi Anda telah dibatalkan oleh admin.',
    selesai:      'Reservasi Anda telah selesai. Terima kasih!'
};

const ALLOWED_STATUS = ['menunggu', 'dikonfirmasi', 'dibatalkan', 'berjalan', 'selesai'];

const getAll = async (user) => {
    if (user.role === 'admin') return findAll();
    return findAllByUser(user.id);
};

const getById = async (id, user) => {
    const reservasi = await findById(id);
    if (!reservasi) throw new AppError('Reservasi tidak ditemukan.', 404);
    if (user.role !== 'admin' && reservasi.user_id !== user.id) {
        throw new AppError('Akses ditolak.', 403);
    }
    return reservasi;
};

const create = async ({ kamar_id, tanggal_masuk, tanggal_keluar }, userId) => {
    if (!kamar_id || !tanggal_masuk || !tanggal_keluar) {
        throw new AppError('Kamar ID, tanggal masuk, dan tanggal keluar wajib diisi.', 400);
    }
    if (new Date(tanggal_masuk) >= new Date(tanggal_keluar)) {
        throw new AppError('Tanggal keluar harus setelah tanggal masuk.', 400);
    }

    const kamar = await _findById(kamar_id);
    if (!kamar) throw new AppError('Kamar tidak ditemukan.', 404);
    if (kamar.status !== 'tersedia') throw new AppError('Kamar tidak tersedia untuk dipesan.', 400);

    const ada_konflik = await findKonflikTanggal(kamar_id, tanggal_masuk, tanggal_keluar);
    if (ada_konflik) throw new AppError('Kamar sudah dipesan pada tanggal tersebut.', 400);

    const total_harga = hitungTotalHarga(tanggal_masuk, tanggal_keluar, kamar.harga_bulan);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const reservasi = await _create(client, { user_id: userId, kamar_id, tanggal_masuk, tanggal_keluar, total_harga });
        await __updateStatus(kamar_id, 'dipesan', client);
        await client.query('COMMIT');
        return reservasi;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const updateStatus = async (id, status) => {
    if (!status || !ALLOWED_STATUS.includes(status)) {
        throw new AppError(`Status tidak valid. Pilih dari: ${ALLOWED_STATUS.join(', ')}`, 400);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const reservasi = await findById(id);
        if (!reservasi) throw new AppError('Reservasi tidak ditemukan.', 404);

        await _updateStatus(client, id, status);

        // Sinkronisasi status kamar
        if (status === 'berjalan') {
            await __updateStatus(reservasi.kamar_id, 'dipesan', client);
        } else if (['dibatalkan', 'selesai'].includes(status)) {
            await __updateStatus(reservasi.kamar_id, 'tersedia', client);
        }

        // Kirim notifikasi ke penyewa
        if (PESAN_STATUS[status]) {
            await __create(client, {
                user_id: reservasi.user_id,
                judul:   `Status Reservasi: ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                pesan:   PESAN_STATUS[status]
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

export default { getAll, getById, create, updateStatus };
