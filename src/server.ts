import './util/module-alias';

import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import * as database from '@src/database';

import { ForecasController } from '@src/controllers/forecast';
import { BeachesController } from '@src/controllers/beaches';
import { UsersController } from '@src/controllers/users';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecasController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening of port:', this.port);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
