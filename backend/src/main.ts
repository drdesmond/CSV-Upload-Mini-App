import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get environment variables with fallbacks
  const port = process.env.PORT || 3000;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  // Enable CORS for frontend
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  console.log(`Backend server running on port ${port}`);
  console.log(`CORS enabled for: ${frontendUrl}`);
}
bootstrap();
