import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const testPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  database: process.env.DB_TEST_NAME || 'quizapp_test',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

export default testPool;