import pembayaranService from '../services/pembayaranService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
    let data;
    if (req.session.user.role === 'admin') {
        data = await pembayaranService.getAll();
    } else {
        // data = await pembayaranService.getByUser(req.session.user.id);
        // (opsional: implementasikan getByUser jika diperlukan)
        data = [];
    }
    sendSuccess(res, data);
});

export const create = asyncHandler(async (req, res) => {
    const data = await pembayaranService.create(req.session.user.id, req.body);
    sendSuccess(res, data, 'Bukti pembayaran berhasil dikirim.', 201);
});

export const updateStatus = asyncHandler(async (req, res) => {
    const data = await pembayaranService.updateStatus(req.params.id, req.body);
    sendSuccess(res, data, 'Status pembayaran berhasil diperbarui.');
});

export default { getAll, create, updateStatus };
