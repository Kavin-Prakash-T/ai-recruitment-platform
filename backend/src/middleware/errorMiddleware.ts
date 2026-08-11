import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for internal tracking
  console.error('Error occurred:', err.message || err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle mongoose validation errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'An account with this email already exists';
  }

  // If status is 200, force it to 500
  const finalStatus = res.statusCode !== 200 ? res.statusCode : statusCode;

  res.status(finalStatus).json({
    success: false,
    message: finalStatus === 500 ? 'An unexpected error occurred on the server.' : message,
  });
};
