import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgreseConfigModule } from 'src/config/database/postgres/config.module';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [PostgreseConfigModule],
      useFactory: async (postgresConfigService: PostgresConfigService) => ({
        ...postgresConfigService.databaseOption,
        // type: 'postgres' as DatabaseType,
        // host: postgresConfigService.host,
        // port: postgresConfigService.port,
        // database: postgresConfigService.database,
        // username: postgresConfigService.username,
        // password: postgresConfigService.password,
      }),
      inject: [PostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class PostgresProviderModule {}
