import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Add prefix to all routes
  const API_PREFIX = 'api/v1';
  app.setGlobalPrefix(API_PREFIX);

  setupSwagger(app);

  const PORT = process.env.NEST_PORT ?? 3000;
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/${API_PREFIX}`);
  });
}
bootstrap();
