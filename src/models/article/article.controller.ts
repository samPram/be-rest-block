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
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { UpdateArticleDto } from './dto/update.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @Roles(Role.WRITER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async postArticle(@Body() data: ArticleDto) {
    return await this.articleService.insertArticle(data);
  }

  @Get()
  @Roles(Role.READER, Role.WRITER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllArticle(@Query() query: any) {
    const { limit = 0, offset = 0, keyword = '' } = query;

    return await this.articleService.getAll(limit, offset, keyword);
  }

  @Get(':id')
  @Roles(Role.READER, Role.WRITER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOneArticle(@Param('id', ParseUUIDPipe) id: string) {
    return await this.articleService.getById(id);
  }

  @Patch(':id')
  @Roles(Role.WRITER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async patchArticle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateArticleDto,
  ) {
    return await this.articleService.updateById(id, data);
  }

  @Delete(':id')
  @Roles(Role.WRITER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteArticle(@Param('id', ParseUUIDPipe) id: string) {
    return await this.articleService.deleteById(id);
  }
}
