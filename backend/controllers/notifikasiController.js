import notifikasiService from '../services/notifikasiService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getNotifikasi = asyncHandler(async (req, res) => {
    const { notifs, unread_count } = await notifikasiService.getByUser(req.session.user.id);
    sendSuccess(res, { notifikasi: notifs, unread_count });
});

export const markAsRead = asyncHandler(async (req, res) => {
    await notifikasiService.markRead(req.params.id, req.session.user.id);
    sendSuccess(res, null, 'Notifikasi ditandai sebagai sudah dibaca.');
});

export const markAllAsRead = asyncHandler(async (req, res) => {
    await notifikasiService.markAllRead(req.session.user.id);
    sendSuccess(res, null, 'Semua notifikasi ditandai sebagai sudah dibaca.');
});

export default { getNotifikasi, markAsRead, markAllAsRead };
