import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

import { Forecast } from '@src/services/forecast';
import { Beach } from '@src/models/beach';
import { authMiddleware } from '@src/middlewares/auth';
import ApiError from '@src/util/errors/api-error';
import { BaseController } from '.';

const forecast = new Forecast();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 3,
  keyGenerator(request: Request): string {
    return request.ip;
  },
  handler(_, response: Response): void {
    response.status(429).send(
      ApiError.format({
        code: 429,
        message: 'Too many requests to the /forecast endpoint',
      }),
    );
  },
});

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecasController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
  public async getForecastForLoggerdUser(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const beaches = await Beach.find({ user: request.decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(beaches);

      response.status(200).send(forecastData);
    } catch (error) {
      this.sendErrorResponse(response, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }
}
