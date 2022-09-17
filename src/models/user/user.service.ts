import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async insertUser(data: any) {
    try {
      const new_user = await this.userRepository.save(data);

      return new_user;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}