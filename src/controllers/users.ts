import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { User } from '@src/models/user';
import { BaseController } from '@src/controllers/index';
import { AuthService } from '@src/services/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = new User(request.body);
      const newUser = await user.save();

      response.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(response, error);
    }
  }

  @Post('authenticate')
  public async authenticcate(
    request: Request,
    response: Response,
  ): Promise<void> {
    const { email, password } = request.body;
    const user = await User.findOne({ email });

    if (!user) {
      return;
    }
    if (!(await AuthService.comparePassword(password, user.password))) {
      return;
    }
    const token = AuthService.generateToken(user.toJSON());
    response.status(200).send({ token });
  }
}
