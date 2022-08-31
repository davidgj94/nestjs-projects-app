import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';

export enum Configs {
  database = 'database',
  server = 'server',
  jwt = 'jwt',
}

export const isTestEnv = process.env.NODE_ENV === 'test';
export const isDevEnv = process.env.NODE_ENV === 'dev';
console.log(process.env.NODE_ENV);

export const databaseConfig = registerAs(
  Configs.database,
  (): DataSourceOptions =>
    !isTestEnv
      ? {
          type: 'postgres',
          database: process.env.DATABASE_NAME,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT || '', 10) || 5432,
          entities: [__dirname + '/../**/*.entity.{ts,js}'],
          migrations: [__dirname + '/../migrations/*.{ts,js}'],
          synchronize: isDevEnv,
          migrationsRun: false,
          logging: true,
          subscribers: [__dirname + '/../**/*.subscriber.{ts,js}'],
        }
      : {
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          migrationsRun: false,
          entities: [__dirname + '/../**/*.entity.{ts,js}'],
          subscribers: [__dirname + '/../**/*.subscriber.{ts,js}'],
        },
);

export const serverConfig = registerAs(Configs.server, () => ({
  port: parseInt(process.env.SERVER_PORT || '', 10) || 8000,
}));

export const jwtConfig = registerAs(
  Configs.jwt,
  (): JwtModuleOptions =>
    !isTestEnv
      ? {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '', 10) || 3600,
          },
        }
      : { secret: 'asdf', signOptions: { expiresIn: 3600 } },
);
