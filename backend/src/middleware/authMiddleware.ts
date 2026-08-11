import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/AuthService';
import { IUser } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, token missing',
      });
      return;
    }

    const authService = new AuthService();
    let decoded: { id: string; role: string };

    try {
      decoded = authService.verifyToken(token);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Not authorized, token expired',
        });
        return;
      }
      res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid',
      });
      return;
    }

    const user = await authService.getUserById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, user not found',
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, user account is inactive',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
