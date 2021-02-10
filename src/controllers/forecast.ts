import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

import { Forecast } from '@src/services/forecast';
import { Beach } from '@src/models/beach';

const forecast = new Forecast();

@Controller('forecast')
export class ForecasController {
  @Get('')
  public async getForecastForLoggerdUser(
    _: Request,
    response: Response,
  ): Promise<void> {
    const beaches = await Beach.find({});
    const forecastData = await forecast.processForecastForBeaches(beaches);

    response.status(200).send(forecastData);
  }
}
