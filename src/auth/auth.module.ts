import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthenticationRepository } from './repositories/auth.repository';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([AuthenticationRepository]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthenticationService, LocalStrategy],
  exports: [AuthenticationService],
})
export class AuthModule {}
