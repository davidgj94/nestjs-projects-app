import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  databaseConfiguration,
  jwtConfiguration,
  serverConfiguration,
} from './config.namespaces';
import { AppConfigService } from './config.service';
import { Environments, isDevEnv } from './constants/environment';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      expandVariables: !isDevEnv,
      load: [serverConfiguration, databaseConfiguration, jwtConfiguration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(...Environments)
          .default('dev' as Environments),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
