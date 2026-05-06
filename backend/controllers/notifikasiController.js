import notifikasiService from '../services/notifikasiService';
import asyncHandler from '../utils/asyncHandler';
import responseUtils from '../utils/response';
const { sendSuccess } = responseUtils;

const getNotifikasi = asyncHandler(async (req, res) => {
    const { notifs, unread_count } = await notifikasiService.getByUser(req.session.user.id);
    sendSuccess(res, { notifikasi: notifs, unread_count });
});

const markAsRead = asyncHandler(async (req, res) => {
    await notifikasiService.markRead(req.params.id, req.session.user.id);
    sendSuccess(res, null, 'Notifikasi ditandai sebagai sudah dibaca.');
});

const markAllAsRead = asyncHandler(async (req, res) => {
    await notifikasiService.markAllRead(req.session.user.id);
    sendSuccess(res, null, 'Semua notifikasi ditandai sebagai sudah dibaca.');
});

export default { getNotifikasi, markAsRead, markAllAsRead };
