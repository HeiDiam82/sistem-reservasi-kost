import { findByUser, markRead as _markRead, markAllRead as _markAllRead } from '../models/notifikasiModel';
import AppError from '../utils/AppError';

const getByUser = async (userId) => {
    const notifs = await findByUser(userId);
    const unread_count = notifs.filter(n => !n.is_read).length;
    return { notifs, unread_count };
};

const markRead = async (id, userId) => {
    const updated = await _markRead(id, userId);
    if (!updated) throw new AppError('Notifikasi tidak ditemukan.', 404);
};

const markAllRead = async (userId) => {
    await _markAllRead(userId);
};

export default { getByUser, markRead, markAllRead };
