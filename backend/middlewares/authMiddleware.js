// Middleware: Memastikan user sudah login
const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized. Silakan login terlebih dahulu.' });
    }
    next();
};


//middleware: memastikan role user
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session?.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Silakan login terlebih dahulu.'
            });
        }

        if (req.session.user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. Hanya ${role} yang diizinkan.`
            });
        }

        next();
    };
};

module.exports = {
    requireAuth,
    requireAdmin: requireRole('admin'),
    requirePenyewa: requireRole('penyewa')
};