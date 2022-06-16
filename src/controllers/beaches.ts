import { ClassMiddleware, Controller, Post } from '@overnightjs/core';

import { Request, Response } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from '@src/controllers/index';
import { BeachRepository } from '@src/repositories';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  constructor(private beachRepository: BeachRepository) {
    super();
  }

  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const data = {
        ...request.body,
        ...{ user: request.decoded?.id },
      };
      const result = await this.beachRepository.create(data);
      response.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(response, error as Error);
    }
  }
}
