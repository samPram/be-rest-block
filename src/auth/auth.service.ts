import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/models/user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginActivity } from './entity/login-activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(LoginActivity)
    private loginActivityRepository: Repository<LoginActivity>,
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

  /**
   * Function to sign in logic
   *
   * @param {string} username
   * @param {string} password
   * @return {*}
   * @memberof AuthService
   */
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

  /**
   * Function to generate access and refresh token
   *
   * @param {string} id
   * @param {string} type
   * @return {*}
   * @memberof AuthService
   */
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

  /**
   * Function to set activity login within record refresh token
   *
   * @param {string} refresh_token
   * @param {string} user_id
   * @memberof AuthService
   */
  async setLoginActivity(refresh_token: string, user_id: string) {
    try {
      const payload = {
        expired: new Date(new Date().setDate(new Date().getDate() + 7)),
      };

      const activity = await this.loginActivityRepository.findOne({
        where: {
          user: {
            id_user: user_id,
          },
        },
      });

      const hash_refresh = await bcrypt.hash(refresh_token, 10);

      if (activity) {
        payload['id_activity'] = activity.id_activity;
      }

      await this.loginActivityRepository.save({
        ...payload,
        refresh_token: hash_refresh,
        user: { id_user: user_id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  /**
   * Function to check match refresh token to generate new access token
   *
   * @param {string} refresh_token
   * @param {string} user_id
   * @return {*}
   * @memberof AuthService
   */
  async matchingRefreshToken(refresh_token: string, user_id: string) {
    try {
      const data = await this.loginActivityRepository.findOne({
        relations: ['user'],
        where: {
          user: { id_user: user_id },
        },
      });
      const isRefreshTokenMatch = await bcrypt.compare(
        refresh_token,
        data?.refresh_token,
      );

      if (isRefreshTokenMatch) {
        return data;
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async logout(id: string) {
    try {
      const result = await this.loginActivityRepository.delete({
        user: {
          id_user: id,
        },
      });

      if (result.affected == 1) {
        return { message: 'Success' };
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
