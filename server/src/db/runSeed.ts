import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME || process.env.DB_TEST_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

const run = async () => {
  const { rows } = await pool.query('SELECT COUNT(*) FROM topics');
  if (parseInt(rows[0].count) > 0) {
    console.log('Database already seeded, skipping.');
    await pool.end();
    return;
  }
  const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
  await pool.query(sql);
  console.log('Seed complete');
  await pool.end();
};

run().catch((err) => { console.error(err); process.exit(1); });
