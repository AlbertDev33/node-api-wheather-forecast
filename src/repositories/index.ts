import { Beach } from '@src/models/beach';

export type WithId<T> = { id: string } & T;

export interface BaseRepository<T> {
  create(data: T): Promise<WithId<T>>;
}

export type BeachRepository = BaseRepository<Beach>;
