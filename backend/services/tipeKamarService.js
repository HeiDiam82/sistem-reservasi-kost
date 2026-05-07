import tipeKamarModel from '../models/tipeKamarModel.js';
import AppError from '../utils/AppError.js';

export const getAll = async () => {
    return await tipeKamarModel.findAll();
};

export const getById = async (id) => {
    const data = await tipeKamarModel.findById(id);
    if (!data) throw new AppError('Tipe kamar tidak ditemukan.', 404);
    return data;
};

export const create = async (data) => {
    return await tipeKamarModel.create(data);
};

export const update = async (id, data) => {
    const updated = await tipeKamarModel.update(id, data);
    if (!updated) throw new AppError('Tipe kamar tidak ditemukan.', 404);
    return updated;
};

export const remove = async (id) => {
    await tipeKamarModel.remove(id);
};

export default { getAll, getById, create, update, remove };
