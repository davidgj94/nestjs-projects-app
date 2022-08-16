import { EntityRepository, Repository } from 'typeorm';
import { AuthenticationEntity } from '../entities/auth.entity';

@EntityRepository(AuthenticationEntity)
export class AuthenticationRepository extends Repository<AuthenticationEntity> {}
