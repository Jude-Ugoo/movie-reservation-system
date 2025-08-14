import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMovieDto } from './dto/add-movie-dto';
import { UpdateMovieDto } from './dto/update-movie-dto';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async addMovie(dto: AddMovieDto) {
    const {
      title,
      description,
      duration_minutes,
      rating,
      release_date,
      language,
      genre,
      poster_url,
    } = dto;

    try {
      const newMovie = await this.prisma.movie.create({
        data: {
          title,
          description,
          duration_minutes,
          rating,
          release_date,
          language,
          genre,
          poster_url,
        },
      });

      return newMovie;
    } catch (error) {
      throw new Error('Failed to add movie');
    }
  }

  async getMovies() {
    try {
      const movies = await this.prisma.movie.findMany({
        orderBy: { created_at: 'desc' },
      });

      if (!movies) {
        throw new NotFoundException('Movies not found!');
      }

      return movies;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving movies.',
      );
    }
  }

  async getMovieById(movieId: string) {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: { movie_id: movieId },
      });

      if (!movie) {
        throw new NotFoundException('Movie not found!');
      }

      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving the movie.',
      );
    }
  }

  async update(movieId: string, dto: UpdateMovieDto) {
    try {
      const updatedMovie = await this.prisma.movie.findUnique({
        where: { movie_id: movieId },
      });
      if (!updatedMovie) {
        throw new NotFoundException('Movie not found!');
      }

      return await this.prisma.movie.update({
        where: { movie_id: movieId },
        data: dto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating the movie.',
      );
    }
  }

  async delete(movieId: string) {
    try {
      const updatedMovie = await this.prisma.movie.findUnique({
        where: { movie_id: movieId },
      });
      if (!updatedMovie) {
        throw new NotFoundException('Movie not found!');
      }

      await this.prisma.movie.delete({
        where: { movie_id: movieId },
      });

      return 'Movie has been removed sucessfully!';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting the movie.',
      );
    }
  }
}
