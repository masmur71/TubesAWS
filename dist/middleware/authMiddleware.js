"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: 'Silakan login terlebih dahulu untuk mengakses halaman ini.',
    });
};
exports.isAuthenticated = isAuthenticated;
// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin yang dapat mengakses halaman ini.',
    });
};
exports.isAdmin = isAdmin;
