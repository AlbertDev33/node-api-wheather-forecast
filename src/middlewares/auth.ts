import { Request, Response, NextFunction } from 'express';

import { AuthService } from '@src/services/auth';

export function authMiddleware(
  request: Partial<Request>,
  response: Partial<Response>,
  next: NextFunction,
): void {
  try {
    const token = request.headers?.['x-access-token'];

    const decoded = AuthService.decodeToken(token as string);
    request.decoded = decoded;
    next();
  } catch (err) {
    response.status?.(401).send({ code: 401, error: err.message });
  }
}
