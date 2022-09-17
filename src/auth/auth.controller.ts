import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserDto } from 'src/models/user/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async postSignup(@Body() data: UserDto) {
    return await this.authService.signup(data);
  }

  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('signin')
  async postSignin(@Req() request: any) {
    const { user } = request;
    console.log(user);

    const access_token = this.authService.getToken(
      user?.id_user,
      'access_token',
    );

    const refresh_token = this.authService.getToken(
      user?.id_user,
      'refresh_token',
    );

    await this.authService.setLoginActivity(refresh_token, user?.id_user);

    return { user, access_token, refresh_token };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async getRefreshToken(@Req() req: any) {
    const { user } = req;

    const access_token = this.authService.getToken(
      user?.id_user,
      'access_token',
    );

    return { access_token };
  }
}
