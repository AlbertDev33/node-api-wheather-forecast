import { Response } from 'express';

import logger from '@src/logger';
import ApiError, { ApiErrorRequest } from '@src/util/errors/api-error';
import {
  DataBaseError,
  DatabaseValidationError,
} from '@src/repositories/repository';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    response: Response,
    error: unknown,
  ): void {
    if (error instanceof DatabaseValidationError) {
      const clientErrors = this.handleClientErrors(error);
      response.status(clientErrors.code).send(
        ApiError.format({
          code: clientErrors.code,
          message: clientErrors.error,
        }),
      );
    } else {
      logger.error(JSON.stringify(error));
      response
        .status(500)
        .send(ApiError.format({ code: 500, message: 'Something went wrong!' }));
    }
  }

  private handleClientErrors(
    error: DataBaseError,
  ): { code: number; error: string } {
    if (error instanceof DatabaseValidationError) {
      return { code: 409, error: error.message };
    }
    return { code: 400, error: error.message };
  }

  protected sendErrorResponse(
    response: Response,
    apiError: ApiErrorRequest,
  ): Response {
    return response.status(apiError.code).send(ApiError.format(apiError));
  }
}
