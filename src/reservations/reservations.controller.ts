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
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully' })
  create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser('user_id') userId: string,
  ) {
    return this.reservationsService.create(createReservationDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all reservations (Admin) or user reservations (Customer)',
  })
  @ApiResponse({ status: 200, description: 'List of reservations' })
  findAll(@GetUser('user_id') userId: string, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';
    if (isAdmin) {
      return this.reservationsService.findAll();
    }
    return this.reservationsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiResponse({ status: 200, description: 'Reservation found' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  findOne(
    @Param('id') id: string,
    @GetUser('user_id') userId: string,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    if (isAdmin) {
      return this.reservationsService.findOne(id);
    }
    return this.reservationsService.findOneByUser(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reservation by ID' })
  @ApiResponse({ status: 200, description: 'Reservation updated successfully' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @GetUser('user_id') userId: string,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    if (isAdmin) {
      return this.reservationsService.update(id, updateReservationDto);
    }
    return this.reservationsService.updateByUser(
      id,
      updateReservationDto,
      userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel reservation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation cancelled successfully',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  remove(
    @Param('id') id: string,
    @GetUser('user_id') userId: string,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    if (isAdmin) {
      return this.reservationsService.remove(id);
    }
    return this.reservationsService.cancelByUser(id, userId);
  }
}
