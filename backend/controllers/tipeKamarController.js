import reservasiService from '../services/reservasiService';
import asyncHandler from '../utils/asyncHandler';
import responseUtils from '../utils/response';
const { sendSuccess } = responseUtils;

const getAll = asyncHandler(async (req, res) => {
    const data = await reservasiService.getAll(req.session.user);
    sendSuccess(res, data);
});

const getById = asyncHandler(async (req, res) => {
    const data = await reservasiService.getById(req.params.id, req.session.user);
    sendSuccess(res, data);
});

const create = asyncHandler(async (req, res) => {
    const data = await reservasiService.create(req.body, req.session.user.id);
    sendSuccess(res, data, 'Reservasi berhasil dibuat. Menunggu konfirmasi admin.', 201);
});

const updateStatus = asyncHandler(async (req, res) => {
    await reservasiService.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, null, `Status reservasi berhasil diubah menjadi ${req.body.status}.`);
});

export default { getAll, getById, create, updateStatus };
