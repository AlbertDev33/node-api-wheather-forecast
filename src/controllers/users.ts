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
  ): Promise<Response> {
    const { email, password } = request.body;
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(401).send({
        code: 401,
        error: 'User not found',
      });
    }
    if (!(await AuthService.comparePassword(password, user.password))) {
      return response.status(401).send({
        code: 401,
        error: 'Password does not match!',
      });
    }
    const token = AuthService.generateToken(user.toJSON());
    return response.status(200).send({ token });
  }
}
