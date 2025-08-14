import { Module } from '@nestjs/common';
import { ReservationSeatsService } from './reservation-seats.service';
import { ReservationSeatsController } from './reservation-seats.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReservationSeatsController],
  providers: [ReservationSeatsService],
})
export class ReservationSeatsModule {}
