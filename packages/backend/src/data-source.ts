import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'newsfeed',
  entities: [
    process.env.NODE_ENV === 'production'
      ? 'dist/**/*.entity.js'
      : 'src/**/*.entity.ts',
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/migrations/*.js'
      : 'src/migrations/*.ts',
  ],
});
