import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/models/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(data: UserDto) {
    try {
      const { password, ...payload } = data;

      const exist_user = await this.userService.getOneByUsername(
        data?.username,
      );

      if (exist_user) {
        throw new BadRequestException('Username already exists!');
      }

      const hash_password = await bcrypt.hash(password, 10);

      const user = await this.userService.insertUser({
        password: hash_password,
        ...payload,
      });

      return user;
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  async signin(data: any) {
    try {
    } catch (error) {}
  }
}
