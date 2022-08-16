import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = app.get(ConfigService).get(Configs.server);
  console.log(`Listening at ${serverConfig.port}`);
  await app.listen(serverConfig.port);
}
bootstrap();
