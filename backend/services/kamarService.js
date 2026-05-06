import { findAll, findById, findByNomorKamar, create as _create, update as _update, hasActiveReservasi, remove as _remove } from '../models/kamarModel';
import AppError from '../utils/AppError';

const getAll = async () => findAll();

const getById = async (id) => {
    const kamar = await findById(id);
    if (!kamar) throw new AppError('Kamar tidak ditemukan.', 404);
    return kamar;
};

const create = async ({ tipe_id, nomor_kamar, lantai, foto_kamar }) => {
    if (!tipe_id || !nomor_kamar) {
        throw new AppError('Tipe ID dan nomor kamar wajib diisi.', 400);
    }
    const existing = await findByNomorKamar(nomor_kamar);
    if (existing) throw new AppError('Nomor kamar sudah digunakan.', 400);

    return _create({ tipe_id, nomor_kamar, lantai, foto_kamar });
};

const update = async (id, body) => {
    const updated = await _update(id, body);
    if (!updated) throw new AppError('Kamar tidak ditemukan.', 404);
    return updated;
};

const remove = async (id) => {
    const hasActive = await hasActiveReservasi(id);
    if (hasActive) {
        throw new AppError('Kamar tidak bisa dihapus karena memiliki reservasi aktif.', 400);
    }
    const deleted = await _remove(id);
    if (!deleted) throw new AppError('Kamar tidak ditemukan.', 404);
};

export default { getAll, getById, create, update, remove };
