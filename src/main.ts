import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Configs } from './config';
import { useGlobals } from './app.helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Projects example')
    .setDescription('The projects API description')
    .setVersion('1.0')
    .addTag('projects')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  useGlobals(app);
  const serverConfig = app.get(ConfigService).get(Configs.server);
  console.log(`Listening at ${serverConfig.port}`);
  await app.listen(serverConfig.port);
}
bootstrap();
