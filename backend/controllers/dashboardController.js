import dashboardService from '../services/dashboardService';
import asyncHandler from '../utils/asyncHandler';
import response from '../utils/response';
const { sendSuccess } = response;

const getDashboardStats = asyncHandler(async (req, res) => {
    const data = await dashboardService.getStats();
    sendSuccess(res, data);
});

export default { getDashboardStats };
