import { PartialType } from '@nestjs/swagger';
import { CreateReservationSeatDto } from './create-reservation-seat.dto';

export class UpdateReservationSeatDto extends PartialType(CreateReservationSeatDto) {}
