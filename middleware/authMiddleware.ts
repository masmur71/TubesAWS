import { Request, Response, NextFunction } from 'express';

// Check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Silakan login terlebih dahulu untuk mengakses halaman ini.',
  });
};

// Check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Akses ditolak. Hanya admin yang dapat mengakses halaman ini.',
  });
};
