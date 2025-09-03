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
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Showtimes')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('showtime')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new showtime (Admin only)' })
  @ApiResponse({ status: 201, description: 'Showtime created successfully' })
  create(
    @Body() createShowtimeDto: CreateShowtimeDto,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all showtimes' })
  @ApiResponse({ status: 200, description: 'List of all showtimes' })
  findAll() {
    return this.showtimesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get showtime by ID' })
  @ApiResponse({ status: 200, description: 'Showtime found' })
  @ApiResponse({ status: 404, description: 'Showtime not found' })
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update showtime by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Showtime updated successfully' })
  @ApiResponse({ status: 404, description: 'Showtime not found' })
  update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.showtimesService.update(id, updateShowtimeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete showtime by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Showtime deleted successfully' })
  @ApiResponse({ status: 404, description: 'Showtime not found' })
  remove(@Param('id') id: string, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.showtimesService.remove(id);
  }
}
