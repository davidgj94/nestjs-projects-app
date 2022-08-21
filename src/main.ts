import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const serverConfig = app.get(ConfigService).get(Configs.server);
  console.log(`Listening at ${serverConfig.port}`);
  await app.listen(serverConfig.port);
}
bootstrap();
