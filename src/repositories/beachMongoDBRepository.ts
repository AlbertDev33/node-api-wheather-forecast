import { Beach } from '@src/models/beach';
import { DefaultMongoDBRepository } from './defaultMongoDBRepository';

export class BeachMongoDBRepository extends DefaultMongoDBRepository<Beach> {
  constructor(private beachModel = Beach) {
    super(beachModel);
  }
}
