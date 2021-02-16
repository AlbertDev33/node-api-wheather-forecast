import { Response } from 'express';
import mongoose from 'mongoose';

import { CUSTOM_VALIDATION } from '@src/models/user';
import logger from '@src/logger';
import ApiError, { ApiErrorRequest } from '@src/util/errors/api-error';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    response: Response,
    error: mongoose.Error.ValidationError | Error,
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      response.status(clientErrors.code).send(
        ApiError.format({
          code: clientErrors.code,
          message: clientErrors.error,
        }),
      );
    } else {
      logger.error(error);
      response
        .status(500)
        .send(ApiError.format({ code: 500, message: 'Something went wrong!' }));
    }
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError,
  ): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      err => err.kind === CUSTOM_VALIDATION.DUPLICATED,
    );
    if (duplicatedKindErrors.length) {
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
