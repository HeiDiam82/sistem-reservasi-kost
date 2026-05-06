import kamarService from '../services/kamarService';
import asyncHandler from '../utils/asyncHandler';
import response from '../utils/response';
const { sendSuccess } = response;

const getAll = asyncHandler(async (req, res) => {
    const data = await kamarService.getAll();
    sendSuccess(res, data);
});

const getById = asyncHandler(async (req, res) => {
    const data = await kamarService.getById(req.params.id);
    sendSuccess(res, data);
});

const create = asyncHandler(async (req, res) => {
    const data = await kamarService.create(req.body);
    sendSuccess(res, data, 'Kamar berhasil ditambahkan.', 201);
});

const update = asyncHandler(async (req, res) => {
    const data = await kamarService.update(req.params.id, req.body);
    sendSuccess(res, data, 'Kamar berhasil diupdate.');
});

const remove = asyncHandler(async (req, res) => {
    await kamarService.remove(req.params.id);
    sendSuccess(res, null, 'Kamar berhasil dihapus.');
});

export default { getAll, getById, create, update, remove };
