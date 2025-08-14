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
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { GetUser, Roles } from 'src/auth/decorator';
import { CreateUserDto } from '../auth/dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRoles } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  getUsers(@GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    return this.userService.getUsers();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserProfile(@GetUser('user_id') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('id') id: string, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    return this.userService.getUserById(id);
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  // @ApiResponse({ status: 200, description: 'User updated successfully' })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // updateUser(
  //   @Param('id') id: string,
  //   @Body() dto: UpdateUserDto,
  //   @GetUser('role') role: string,
  // ) {
  //   const isAdmin = role === 'ADMIN';

  //   if (!isAdmin) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this resource',
  //     );
  //   }

  //   return this.userService.updateUser(id, dto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  // @ApiResponse({ status: 200, description: 'User deleted successfully' })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // deleteUser(@Param('id') id: string, @GetUser('role') role: string) {
  //   const isAdmin = role === 'ADMIN';

  //   if (!isAdmin) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this resource',
  //     );
  //   }

  //   return this.userService.deleteUser(id);
  // }
}
