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
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Seats')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new seat (Admin only)' })
  @ApiResponse({ status: 201, description: 'Seat created successfully' })
  create(@Body() createSeatDto: CreateSeatDto, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.seatsService.create(createSeatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all seats' })
  @ApiResponse({ status: 200, description: 'List of all seats' })
  findAll() {
    return this.seatsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get seat by ID' })
  @ApiResponse({ status: 200, description: 'Seat found' })
  @ApiResponse({ status: 404, description: 'Seat not found' })
  findOne(@Param('id') id: string) {
    return this.seatsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update seat by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Seat updated successfully' })
  @ApiResponse({ status: 404, description: 'Seat not found' })
  update(
    @Param('id') id: string,
    @Body() updateSeatDto: UpdateSeatDto,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.seatsService.update(id, updateSeatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete seat by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Seat deleted successfully' })
  @ApiResponse({ status: 404, description: 'Seat not found' })
  remove(@Param('id') id: string, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.seatsService.remove(id);
  }

  @Get('theater/:id')
  @ApiOperation({ summary: 'Get seats by theater ID' })
  @ApiResponse({ status: 200, description: 'List of seats by theater' })
  @ApiResponse({ status: 404, description: 'Theater not found' })
  findByTheater(@Param('id') id: string) {
    return this.seatsService.findByTheater(id);
  }
}
