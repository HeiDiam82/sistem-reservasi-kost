import kamarModel from '../models/kamarModel.js';
import AppError from '../utils/AppError.js';

export const getAll = async () => {
    return await kamarModel.findAll();
};

export const getById = async (id) => {
    const data = await kamarModel.findById(id);
    if (!data) throw new AppError('Kamar tidak ditemukan.', 404);
    return data;
};

export const create = async (data) => {
    return await kamarModel.create(data);
};

export const update = async (id, data) => {
    const updated = await kamarModel.update(id, data);
    if (!updated) throw new AppError('Kamar tidak ditemukan.', 404);
    return updated;
};

export const remove = async (id) => {
    await kamarModel.remove(id);
};

export default { getAll, getById, create, update, remove };
