import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * Function to insert new user to database
   *
   * @param {*} data
   * @return {*}
   * @memberof UserService
   */
  async insertUser(data: any) {
    try {
      const new_user = await this.userRepository.save(data);

      return new_user;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  /**
   * Get one user by username from database
   *
   * @param {string} username
   * @return {*}
   * @memberof UserService
   */
  async getOneByUsername(username: string) {
    try {
      const result = await this.userRepository
        .createQueryBuilder('user')
        .where(`user.username = :cond`, { cond: username })
        .getOne();

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  /**
   * Function get one user by id from database
   *
   * @param {string} id
   * @return {*}
   * @memberof UserService
   */
  async getById(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id_user: id });

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async updateOneById(id: string, data: any) {
    try {
      const update = await this.userRepository.update(id, data);

      return update;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
