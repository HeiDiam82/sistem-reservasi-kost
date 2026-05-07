import notifikasiModel from '../models/notifikasiModel.js';
import db from '../config/db.js';

export const getByUser = async (userId) => {
    const notifs = await notifikasiModel.findByUser(userId);
    const unread_count = notifs.filter(n => !n.is_read).length;
    return { notifs, unread_count };
};

export const create = async (client, data) => {
    return await notifikasiModel.create(client, data);
};

export const markRead = async (id, userId) => {
    return await notifikasiModel.markRead(id, userId);
};

export const markAllRead = async (userId) => {
    return await notifikasiModel.markAllRead(userId);
};

export default { getByUser, create, markRead, markAllRead };
