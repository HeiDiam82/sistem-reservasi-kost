const sendSuccess = (res, data = null, message = 'Berhasil.', statusCode = 200) => {
    const payload = { success: true, message };
    if (data !== null) payload.data = data;
    return res.status(statusCode).json(payload);
};

const sendError = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({ success: false, message });
};

export default { sendSuccess, sendError };
