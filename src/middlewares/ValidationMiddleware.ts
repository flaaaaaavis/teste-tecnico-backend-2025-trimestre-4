import { NextFunction, Request, Response } from 'express';
import { ObjectSchema, ValidationError } from 'yup';
import { logger } from '@libs/logger';

export const validateSchema = (schema: ObjectSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      logger.error(error);

      if (error instanceof ValidationError) {
        return res.status(400).json({
          code: 'VALIDATION_ERROR',
          message: 'Erro de validação',
          field_errors: error.inner.map(
            (err) => `${err.path}: ${err.message}`
          ),
        });
      }

      return res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Erro interno',
      });
    }
  };
};
