import { Module } from '@nestjs/common';
import { UserModule } from 'src/models/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginActivity } from './entity/login-activity.entity';
import { JwtRefreshStrategy } from './jwt-refreht.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginActivity]),
    UserModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
