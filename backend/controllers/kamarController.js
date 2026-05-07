import kamarService from '../services/kamarService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
    const data = await kamarService.getAll();
    sendSuccess(res, data);
});

export const getById = asyncHandler(async (req, res) => {
    const data = await kamarService.getById(req.params.id);
    sendSuccess(res, data);
});

export const create = asyncHandler(async (req, res) => {
    const data = await kamarService.create(req.body);
    sendSuccess(res, data, 'Kamar berhasil ditambahkan.', 201);
});

export const update = asyncHandler(async (req, res) => {
    const data = await kamarService.update(req.params.id, req.body);
    sendSuccess(res, data, 'Kamar berhasil diupdate.');
});

export const remove = asyncHandler(async (req, res) => {
    await kamarService.remove(req.params.id);
    sendSuccess(res, null, 'Kamar berhasil dihapus.');
});

export default { getAll, getById, create, update, remove };
