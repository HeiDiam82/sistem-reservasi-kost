import pembayaranService from '../services/pembayaranService';
import asyncHandler from '../utils/asyncHandler';
import response from '../utils/response';
const { sendSuccess } = response;

const getAll = asyncHandler(async (req, res) => {
    const data = await pembayaranService.getAll(req.session.user);
    sendSuccess(res, data);
});

const create = asyncHandler(async (req, res) => {
    const data = await pembayaranService.create(req.body, req.session.user.id);
    sendSuccess(res, data, 'Pembayaran berhasil dicatat. Menunggu verifikasi admin.', 201);
});

const updateStatus = asyncHandler(async (req, res) => {
    await pembayaranService.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, null, `Status pembayaran berhasil diubah menjadi ${req.body.status}.`);
});

export default { getAll, create, updateStatus };
