import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { setupSwagger } from './swagger';
import * as winston from 'winston';
import { sanitizeBody } from './helpers/hide-sentitive-data-logger.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create a Winston logger instance
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        return `[${timestamp}] ${level.toUpperCase()} - ${message}`;
      }),
    ),
    transports: [new winston.transports.Console()],
  });

  // Middleware Log Request
  app.use((req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, url, body } = req;
    const startTime = Date.now();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    res.on('finish', () => {
      const duration = Date.now() - startTime;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      let logMessage = `${method} ${url} - ${res.statusCode} (${duration}ms) from ${clientIp}`;

      // Only log body with POST, PUT
      if (['POST', 'PUT'].includes(method) && Object.keys(body).length > 0) {
        logMessage += ` | Body: ${JSON.stringify(sanitizeBody(body))}`;
      }

      logger.info(logMessage);
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    next();
  });

  // Enable CORS
  app.enableCors();

  // Add prefix to all routes
  const API_PREFIX = 'api/v1';
  app.setGlobalPrefix(API_PREFIX);

  setupSwagger(app);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/${API_PREFIX}`);
  });
}
bootstrap();
