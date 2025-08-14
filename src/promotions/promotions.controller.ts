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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new promotion (Admin only)' })
  @ApiResponse({ status: 201, description: 'Promotion created successfully' })
  create(
    @Body() createPromotionDto: CreatePromotionDto,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active promotions' })
  @ApiResponse({ status: 200, description: 'List of all promotions' })
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion by ID' })
  @ApiResponse({ status: 200, description: 'Promotion found' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update promotion by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Promotion updated successfully' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete promotion by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Promotion deleted successfully' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  remove(@Param('id') id: string, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return this.promotionsService.remove(id);
  }
}
