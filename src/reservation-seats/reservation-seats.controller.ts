import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReservationSeatsService } from './reservation-seats.service';
import { CreateReservationSeatDto } from './dto/create-reservation-seat.dto';
import { UpdateReservationSeatDto } from './dto/update-reservation-seat.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Reservation Seats')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('reservation-seats')
export class ReservationSeatsController {
  constructor(
    private readonly reservationSeatsService: ReservationSeatsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation seat' })
  @ApiResponse({
    status: 201,
    description: 'Reservation seat created successfully',
  })
  create(
    @Body() createReservationSeatDto: CreateReservationSeatDto,
    @GetUser('user_id') userId: string,
  ) {
    return this.reservationSeatsService.create(
      createReservationSeatDto,
      userId,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all reservation seats (Admin) or user reservation seats (Customer)',
  })
  @ApiResponse({ status: 200, description: 'List of reservation seats' })
  findAll(@GetUser('user_id') userId: string, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';
    if (isAdmin) {
      return this.reservationSeatsService.findAll();
    }
    return this.reservationSeatsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation seat by ID' })
  @ApiResponse({ status: 200, description: 'Reservation seat found' })
  @ApiResponse({ status: 404, description: 'Reservation seat not found' })
  findOne(
    @Param('id') id: string,
    @GetUser('user_id') userId: string,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    if (isAdmin) {
      return this.reservationSeatsService.findOne(id);
    }
    return this.reservationSeatsService.findOneByUser(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reservation seat by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation seat updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Reservation seat not found' })
  update(
    @Param('id') id: string,
    @Body() updateReservationSeatDto: UpdateReservationSeatDto,
    @GetUser('user_id') userId: string,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    if (isAdmin) {
      return this.reservationSeatsService.update(id, updateReservationSeatDto);
    }
    return this.reservationSeatsService.updateByUser(
      id,
      updateReservationSeatDto,
      userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove reservation seat by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation seat removed successfully',
  })
  @ApiResponse({ status: 404, description: 'Reservation seat not found' })
  remove(
    @Param('id') id: string,
    @GetUser('user_id') userId: string,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    if (isAdmin) {
      return this.reservationSeatsService.remove(id);
    }
    return this.reservationSeatsService.removeByUser(id, userId);
  }
}
