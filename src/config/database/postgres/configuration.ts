import { registerAs } from '@nestjs/config';
import { DatabaseType } from 'typeorm';
export default registerAs('postgres', () => ({
  type: 'postgres' as DatabaseType,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB || 'blog',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'pakpram1141',
  entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migration_table',
  synchronize: true,
  logging: true,
  ssl: { rejectUnauthorized: false },
  cli: {
    migrationsDir: 'src/database/migrations', // This path will be used by typeorm cli when we create a new migration
  },
}));
