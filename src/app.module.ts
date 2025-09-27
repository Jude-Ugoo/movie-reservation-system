import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MovieService } from './movie/movie.service';
import { MovieModule } from './movie/movie.module';
import { TheatersController } from './theaters/theaters.controller';
import { TheatersService } from './theaters/theaters.service';
import { TheatersModule } from './theaters/theaters.module';
import { SeatsModule } from './seats/seats.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ReservationSeatsModule } from './reservation-seats/reservation-seats.module';
import { PromotionsModule } from './promotions/promotions.module';
import { PaymentsModule } from './payments/payments.module';
import { EmailNotificationsModule } from './email-notifications/email-notifications.module';
import config from './config/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MovieModule,
    TheatersModule,
    SeatsModule,
    ShowtimesModule,
    ReservationsModule,
    ReservationSeatsModule,
    PromotionsModule,
    PaymentsModule,
    EmailNotificationsModule,
    HttpModule
  ],
  controllers: [AppController, UsersController, TheatersController],
  providers: [AppService, UsersService, MovieService, TheatersService],
})
export class AppModule {}
