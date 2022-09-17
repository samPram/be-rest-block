import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/models/user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Signup function is logic for signup process
   *
   * @param {UserDto} data
   * @return {*}
   * @memberof AuthService
   */
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

      delete user?.password;

      return user;
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  async signin(username: string, password: string) {
    try {
      const user = await this.userService.getOneByUsername(username);

      if (!user) {
        throw new NotFoundException('User does not exists!');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new BadRequestException('Password does not match!');
      }

      return user;
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  getToken(id: string, type: string) {
    let config;

    if (type === 'access_token') {
      config = {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      };
    }

    if (type == 'refresh_token') {
      config = {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      };
    }
    return this.jwtService.sign({ sub: id }, config);
  }
}
