import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  const user = await userService.create({
    email: 'davidg2j@gmail.com',
    firstName: 'David',
    lastName: 'Gallardo',
    password: 'asdf123',
    role: 'ADMIN',
  });
  console.log(user);
}
bootstrap();
