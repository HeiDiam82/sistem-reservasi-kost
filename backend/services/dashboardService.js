import dashboardModel from '../models/dashboardModel.js';

export const getStats = async () => {
    return await dashboardModel.getStats();
};

export default { getStats };
