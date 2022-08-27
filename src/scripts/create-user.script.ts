import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  const user = await userService.create({
    email: 'davidgj2@gmail.com',
    firstName: 'David',
    lastName: 'Gallardo',
    password: 'asdf123',
    role: 'USER',
  });
  console.log(user);
}
bootstrap();
