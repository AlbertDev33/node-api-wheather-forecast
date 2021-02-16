import { Request, Response, NextFunction } from 'express';
import ApiError from '@src/util/errors/api-error';

export interface HTTPError extends Error {
  status?: number;
}

export function apiErrorValidator(
  error: HTTPError,
  _: Partial<Request>,
  response: Response,
  __: NextFunction,
): void {
  const errorCode = error.status || 500;

  response
    .status(errorCode)
    .send(ApiError.format({ code: errorCode, message: error.message }));
}
