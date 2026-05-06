import { findAll, findById, create as _create, update as _update, remove as _remove } from '../models/tipeKamarModel';
import AppError from '../utils/AppError';

const getAll = async () => findAll();

const getById = async (id) => {
    const tipe = await findById(id);
    if (!tipe) throw new AppError('Tipe kamar tidak ditemukan.', 404);
    return tipe;
};

const create = async ({ nama_tipe, harga_bulan, fasilitas }) => {
    if (!nama_tipe || !harga_bulan) {
        throw new AppError('Nama tipe dan harga bulan wajib diisi.', 400);
    }
    return _create({ nama_tipe, harga_bulan, fasilitas });
};

const update = async (id, body) => {
    const updated = await _update(id, body);
    if (!updated) throw new AppError('Tipe kamar tidak ditemukan.', 404);
    return updated;
};

const remove = async (id) => {
    const deleted = await _remove(id);
    if (!deleted) throw new AppError('Tipe kamar tidak ditemukan.', 404);
};

export default { getAll, getById, create, update, remove };
