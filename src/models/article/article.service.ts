import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleDto } from './dto/article.dto';
import { UpdateArticleDto } from './dto/update.dto';
import { Article } from './entity/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
  ) {}

  async insertArticle(data: ArticleDto) {
    try {
      const { writer, category, ...other } = data;
      const new_article = await this.articleRepo.save({
        posted: new Date(),
        writer: {
          id_user: writer,
        },
        category: {
          id_category: category,
        },
        ...other,
      });

      return new_article;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async getAll(limit: number, offset: number, keyword: string) {
    try {
      const query = this.articleRepo
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.writer', 'user')
        .leftJoinAndSelect('article.category', 'category');

      if (keyword) {
        query.where("(article.title iLIKE '%' || :keyword || '%')", {
          keyword: keyword,
        });
      }

      const [result, total] = await query
        .limit(limit)
        .offset(offset)
        .getManyAndCount();

      return {
        data: result,
        total: keyword ? result?.length : total,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async getById(id: string) {
    try {
      const data = await this.articleRepo.findOne({
        where: {
          id_article: id,
        },
      });

      return data;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async updateById(id: string, data: UpdateArticleDto) {
    try {
      const { category = '', ...other } = data;

      if (category) {
        other['category'] = { id_category: category };
      }

      const update = await this.articleRepo.save({
        id_article: id,
        ...other,
      });

      return update;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async deleteById(id: string) {
    try {
      const result = await this.articleRepo.delete(id);

      if (result.affected === 1) {
        return { message: 'Success' };
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
