import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/config.module';
import { PostgreseConfigModule } from './config/database/postgres/config.module';
import { UserModule } from './models/user/user.module';
import { ArticleModule } from './models/article/article.module';
import { PostgresProviderModule } from './providers/databases/postgres/provider.module';
import { CategoryModule } from './models/category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AppConfigModule,
    PostgreseConfigModule,
    PostgresProviderModule,
    AuthModule,
    UserModule,
    ArticleModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
