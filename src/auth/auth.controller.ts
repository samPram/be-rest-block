import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from 'src/models/user/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async postSignup(@Body() data: UserDto) {
    return await this.authService.signup(data);
  }

  @Post('signin')
  async postSignin(@Body() data: any) {
    return await this.authService.signin(data);
  }
}
