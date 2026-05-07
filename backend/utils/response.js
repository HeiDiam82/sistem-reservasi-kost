export const sendSuccess = (res, data, message = 'Berhasil.', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const sendError = (res, message = 'Gagal.', statusCode = 400) => {
    res.status(statusCode).json({
        success: false,
        message
    });
};
