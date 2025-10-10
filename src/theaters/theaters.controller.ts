import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TheatersService } from './theaters.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { GetUser, Roles } from 'src/auth/decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRoles } from '@prisma/client';

@ApiTags('Theaters')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('theater')
export class TheatersController {
  constructor(private theaterService: TheatersService) {}

  // @UseGuards(RoleGuard)
  // @Roles(UserRoles.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Add a new theater (Admin only)' })
  @ApiResponse({ status: 201, description: 'Theater added successfully' })
  addTheater(@Body() dto: CreateTheaterDto, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.theaterService.addTheater(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all theaters' })
  @ApiResponse({ status: 200, description: 'List of all theaters' })
  getTheaters() {
    return this.theaterService.getAllTheaters();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get theater by id' })
  @ApiResponse({ status: 200, description: 'List theather with specified id' })
  @ApiResponse({ status: 404, description: 'Theater not found' })
  async getTheater(@Param('id') id: string) {
    return this.theaterService.getTheaterById(id);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update theater by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Theater updated successfully' })
  @ApiResponse({ status: 404, description: 'Theater not found' })
  updateTheater(
    @Param('id') id: string,
    @Body() dto: UpdateTheaterDto,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    return this.theaterService.updateTheater(id, dto);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete theater by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Theater deleted successfully' })
  @ApiResponse({ status: 404, description: 'Theater not found' })
  deleteTheater(@Param('id') id: string, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    this.theaterService.deleteTheater(id);

    return "Theater removed successfully";
  }
}
