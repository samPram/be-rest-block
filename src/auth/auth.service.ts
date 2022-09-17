import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(data: any) {
    try {
      const { password, ...payload } = data;

      const hash_password = await bcrypt.hash(password, 10);

      const user = await this.userService.insertUser({
        password: hash_password,
        ...payload,
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async signin(data: any) {
    try {
    } catch (error) {}
  }
}
