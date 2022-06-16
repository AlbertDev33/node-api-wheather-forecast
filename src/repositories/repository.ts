/* eslint-disable max-classes-per-file */
import { BaseRepository, WithId } from '.';

export class DataBaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseValidationError extends DataBaseError {}
export class DatabaseUnknownClientError extends DataBaseError {}
export class DatabaseInternalError extends DataBaseError {}

export abstract class Repository<T> implements BaseRepository<T> {
  public abstract create(data: T): Promise<WithId<T>>;
}
