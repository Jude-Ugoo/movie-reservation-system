import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('MOVIE RESERVATION API')
  .setDescription('API for Movie Reservations')
  .setVersion('1.0')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
  //   .addServer('https://eazify-lms-backend.onrender.com/')
  .build();
