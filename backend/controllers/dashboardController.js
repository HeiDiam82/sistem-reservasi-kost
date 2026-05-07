import dashboardService from '../services/dashboardService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await dashboardService.getStats();
    sendSuccess(res, stats);
});

export default { getDashboardStats };
