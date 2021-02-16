/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import logger from '@src/logger';
import _ from 'lodash';

import { StormGlass, ForecastPoint } from '@src/clients/StormGlass';
import { ForecastProcessingInternalError } from '@src/util/errors/forecast-processing-internal-error';
import { Beach } from '@src/models/beach';
import { Rating } from './rating';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class Forecast {
  constructor(
    protected stormGlass = new StormGlass(),

    protected RatingService: typeof Rating = Rating,
  ) {}

  public async processForecastForBeaches(
    beaches: Beach[],
  ): Promise<TimeForecast[]> {
    try {
      const beachForecast = await this.calculateRating(beaches);
      const timeForecast = this.mapForecastByTime(beachForecast);
      return timeForecast.map(t => ({
        time: t.time,
        // TODO Allow ordering to be dynamic
        // Sorts the beaches by its ratings
        forecast: _.orderBy(t.forecast, ['rating'], ['desc']),
      }));
    } catch (error) {
      logger.error(error);
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private async calculateRating(beaches: Beach[]): Promise<BeachForecast[]> {
    const pointWithCorrectSources: BeachForecast[] = [];
    logger.info(`Preparing the foreast for ${beaches.length} beaches`);

    for (const beach of beaches) {
      const rating = new this.RatingService(beach);
      // TODO Promise All implement. To mak this call in parallel
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = this.enrichedBeachData(points, beach, rating);
      pointWithCorrectSources.push(...enrichedBeachData);
    }

    return pointWithCorrectSources;
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach,
    rating: Rating,
  ): BeachForecast[] {
    return points.map(point => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(point),
      },
      ...point,
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
