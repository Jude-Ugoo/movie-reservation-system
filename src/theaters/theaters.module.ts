import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TheatersController } from './theaters.controller';
import { TheatersService } from './theaters.service';

@Module({
  imports: [PrismaModule],
  controllers: [TheatersController],
  providers: [TheatersService],
})
export class TheatersModule {}
