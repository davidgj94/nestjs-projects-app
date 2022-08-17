import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';

export enum Configs {
  database = 'database',
  server = 'server',
  jwt = 'jwt',
}

export const databaseConfig = registerAs(
  Configs.database,
  (): DataSourceOptions => ({
    type: 'postgres',
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '', 10) || 5432,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    synchronize: true,
    migrationsRun: false,
    logging: true,
    subscribers: [__dirname + '/../**/*.subscriber.{ts,js}'],
  }),
);

export const serverConfig = registerAs(Configs.server, () => ({
  port: parseInt(process.env.SERVER_PORT || '', 10) || 8000,
}));

export const jwtConfig = registerAs(
  Configs.jwt,
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
  }),
);
