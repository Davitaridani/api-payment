import 'dotenv/config';
import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import { join } from 'path';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: `${process.env.POSTGRES_USERNAME}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_NAME}`,
  entities: [
    join(__dirname, '..', isProduction ? '**/*.entity.js' : '**/*.entity.ts'),
  ],
  migrations: [join(__dirname, 'migrations', isProduction ? '*.js' : '*.ts')],

  synchronize: false,
  logging: true,
});
