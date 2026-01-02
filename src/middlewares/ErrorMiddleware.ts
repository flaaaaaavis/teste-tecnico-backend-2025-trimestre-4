import { NextFunction, Request, Response } from 'express';
import { logger } from '@libs/logger';

interface AppError extends Error {
  status?: number;
  code?: string;
  field_errors?: string[];
}

export const ErrorMiddleware = (
  error: AppError,
  _: Request,
  response: Response,
  __: NextFunction
): Response => {
  const status = error.status ?? 500;
  const message = error.message || 'Something went wrong';
  const code = error.code ?? '01.00';
  const field_errors = error.field_errors;

  logger.error({
    message,
    code,
    status,
    field_errors,
    stack: error.stack,
  });

  return response.status(status).json({
    message,
    code,
    field_errors,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}

