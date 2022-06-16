/* eslint-disable consistent-return */
import logger from '@src/logger';
import { BaseModel } from '@src/models';
import { CUSTOM_VALIDATION } from '@src/models/user';
import { Model, Error as MongoError } from 'mongoose';
import { WithId } from '.';
import {
  Repository,
  DatabaseValidationError,
  DatabaseUnknownClientError,
  DatabaseInternalError,
} from './repository';

const ERROR_MESSAGE = 'Something unexpected happend to the database';

export abstract class DefaultMongoDBRepository<
  T extends BaseModel
> extends Repository<T> {
  constructor(private ClassModel: Model<T>) {
    super();
  }

  public async create(data: T): Promise<WithId<T>> {
    try {
      const model = new this.ClassModel(data);
      const createdData = await model.save();
      return createdData.toJSON<WithId<T>>() as WithId<T>;
    } catch (err) {
      this.handleError(err);
    }
  }

  protected handleError(error: unknown): never {
    if (error instanceof MongoError.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter(
        err =>
          err.name === 'ValidatorError' &&
          err.kind === CUSTOM_VALIDATION.DUPLICATED,
      );
      if (duplicatedKindErrors.length) {
        throw new DatabaseValidationError(error.message);
      }
      throw new DatabaseUnknownClientError(
        JSON.stringify(error instanceof Error && error.message),
      );
    }
    logger.warn(`Database error: ${error}`);
    throw new DatabaseInternalError(ERROR_MESSAGE);
  }
}
