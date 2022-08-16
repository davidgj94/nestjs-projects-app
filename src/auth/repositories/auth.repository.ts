import { Repository } from 'typeorm';
import { AuthenticationEntity } from '../entities/auth.entity';

export class AuthenticationRepository extends Repository<AuthenticationEntity> {}
