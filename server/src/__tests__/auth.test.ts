import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/authRoutes';
import testPool from './testDb';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  await testPool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
});

afterAll(async () => {
  await testPool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
  await testPool.end();
});

describe('POST /api/auth/register', () => {
  it('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser2', email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email already in use');
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('rejects unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});