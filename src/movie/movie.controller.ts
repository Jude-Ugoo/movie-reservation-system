import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
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
import { MovieService } from './movie.service';
import { AddMovieDto } from './dto/add-movie-dto';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRoles } from '@prisma/client';

@ApiTags('Movie')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Add a new movie (Admin only)' })
  @ApiResponse({ status: 201, description: 'Movie added successfully' })
  addMovie(@Body() dto: AddMovieDto, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.movieService.addMovie(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'List of all movies' })
  getMovies() {
    return this.movieService.getMovies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie found' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  getMovieById(@Param('id') id: string) {
    return this.movieService.getMovieById(id);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  updateMovie(
    @Param('id') id: string,
    @Body() dto: AddMovieDto,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    return this.movieService.update(id, dto);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  deleteMovie(@Param('id') id: string, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    return this.movieService.delete(id);
  }
}
