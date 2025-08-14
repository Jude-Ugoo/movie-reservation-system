import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MovieService } from './movie.service';

@Module({
  imports: [PrismaModule],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule {}
