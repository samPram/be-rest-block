import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update.dto';
import { CategoryEntity } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  /**
   * Function for insert new cateogry to database
   *
   * @param {CategoryDto} data
   * @return {*}
   * @memberof CategoryService
   */
  async insertCategory(data: CategoryDto) {
    try {
      const new_category = await this.categoryRepository.save(data);

      return new_category;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  /**
   * Functionto to get specific category by Id
   *
   * @param {string} id
   * @return {*}
   * @memberof CategoryService
   */
  async getById(id: string) {
    try {
      const data = await this.categoryRepository.findOneBy({ id_category: id });

      return data;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  /**
   * Function to get All Category with pagination
   *
   * @param {number} [limit=10]
   * @param {number} [offset=0]
   * @param {string} [keyword='']
   * @return {*}
   * @memberof CategoryService
   */
  async getAll(limit = 10, offset = 0, keyword = '') {
    try {
      const query = this.categoryRepository.createQueryBuilder('category');

      if (keyword) {
        query.where(
          "(category.name iLIKE '%' || :keyword || '%' OR category.description iLIKE '%' || :keyword || '%')",
          { keyword: keyword },
        );
      }

      const [result, total] = await query
        .limit(limit)
        .offset(offset)
        // .printSql()
        .getManyAndCount();

      return { data: result, total: keyword ? result?.length : total };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  /**
   * Update Cateogry by Id
   *
   * @param {string} id
   * @param {UpdateCategoryDto} data
   * @return {*}
   * @memberof CategoryService
   */
  async updateById(id: string, data: UpdateCategoryDto) {
    try {
      const result = await this.categoryRepository.save({
        id_category: id,
        ...data,
      });

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  /**
   * Function to delete category by id
   *
   * @param {string} id
   * @return {*}
   * @memberof CategoryService
   */
  async deleteById(id: string) {
    try {
      const result = await this.categoryRepository.delete(id);

      if (result.affected == 1) {
        return { message: 'Success' };
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
