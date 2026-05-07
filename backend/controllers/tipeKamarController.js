import tipeKamarService from '../services/tipeKamarService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
    const data = await tipeKamarService.getAll();
    sendSuccess(res, data);
});

export const getById = asyncHandler(async (req, res) => {
    const data = await tipeKamarService.getById(req.params.id);
    sendSuccess(res, data);
});

export const create = asyncHandler(async (req, res) => {
    const data = await tipeKamarService.create(req.body);
    sendSuccess(res, data, 'Tipe kamar berhasil dibuat.', 201);
});

export const update = asyncHandler(async (req, res) => {
    const data = await tipeKamarService.update(req.params.id, req.body);
    sendSuccess(res, data, 'Tipe kamar berhasil diupdate.');
});

export const remove = asyncHandler(async (req, res) => {
    await tipeKamarService.remove(req.params.id);
    sendSuccess(res, null, 'Tipe kamar berhasil dihapus.');
});

export default { getAll, getById, create, update, remove };