import { Request, Response, NextFunction } from 'express';

import { AuthService } from '@src/services/auth';

export function authMiddleware(
  request: Partial<Request>,
  _: Partial<Response>,
  next: NextFunction,
): void {
  const token = request.headers?.['x-access-token'];

  const decoded = AuthService.decodeToken(token as string);
  request.decoded = decoded;
  next();
}
