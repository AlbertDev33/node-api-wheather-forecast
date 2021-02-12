/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { StormGlass, ForecastPoint } from '@src/clients/StormGlass';
import { ForecastProcessingInternalError } from '@src/util/errors/forecast-processing-internal-error';
import { Beach } from '@src/models/beach';
import logger from '@src/logger';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[],
  ): Promise<TimeForecast[]> {
    const pointWithCorrectSources: BeachForecast[] = [];
    logger.info(`Preparing the foreast for ${beaches.length} beaches`);
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach);
        pointWithCorrectSources.push(...enrichedBeachData);
      }
      return this.mapForecastByTime(pointWithCorrectSources);
    } catch (error) {
      logger.error(error);
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach,
  ): BeachForecast[] {
    return points.map(response => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...response,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find(f => f.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return forecastByTime;
  }
}
