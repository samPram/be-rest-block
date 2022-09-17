import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from '../user/entity/user.entity';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async postCategory(@Body() data: CategoryDto) {
    return await this.categoryService.insertCategory(data);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCategory(@Query() query: any) {
    const { limit = 10, offset = 0, keyword = '' } = query;

    return await this.categoryService.getAll(limit, offset, keyword);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOneCategory(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.getById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async patchCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateById(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.deleteById(id);
  }
}
