import authService from '../services/authService';
import asyncHandler from '../utils/asyncHandler';
import responseUtils from '../utils/response';
const { sendSuccess } = responseUtils;

const register = asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);
    sendSuccess(res, data, 'Registrasi berhasil.', 201);
});

const login = asyncHandler(async (req, res) => {
    const user = await authService.login(req.body);
    // Simpan sesi
    req.session.user = { id: user.user_id, email: user.email, role: user.role, nama: user.nama };
    sendSuccess(res, user, 'Login berhasil.');
});

const logout = asyncHandler(async (req, res) => {
    await new Promise((resolve, reject) => {
        req.session.destroy((err) => (err ? reject(err) : resolve()));
    });
    res.clearCookie('connect.sid');
    sendSuccess(res, null, 'Logout berhasil.');
});

const getMe = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.session.user.id);
    sendSuccess(res, user);
});

export default { register, login, logout, getMe };
