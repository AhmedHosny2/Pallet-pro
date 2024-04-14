import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './services/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const authService = app.get(AuthService);
  await authService.startConsumer();
  await app.listen(3000);
}
bootstrap();
