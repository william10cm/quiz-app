import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/authRoutes';
import quizRoutes from '../routes/quizRoutes';
import testPool from './testDb';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

let token: string;

beforeAll(async () => {
  await testPool.query('DELETE FROM users WHERE email = $1', ['quiztest@example.com']);

  await request(app)
    .post('/api/auth/register')
    .send({ username: 'quizuser', email: 'quiztest@example.com', password: 'password123' });

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'quiztest@example.com', password: 'password123' });

  token = res.body.token;
});

afterAll(async () => {
  await testPool.query('DELETE FROM users WHERE email = $1', ['quiztest@example.com']);
  await testPool.end();
});

describe('GET /api/quiz/topics', () => {
  it('returns topics when authenticated', async () => {
    const res = await request(app)
      .get('/api/quiz/topics')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/quiz/topics');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/quiz/:topicId', () => {
  it('returns questions for valid topic', async () => {
    const res = await request(app)
      .get('/api/quiz/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('question_text');
    expect(res.body[0]).toHaveProperty('options');
    expect(res.body[0].options[0]).not.toHaveProperty('is_correct');
  });
});

describe('GET /api/quiz/history', () => {
  it('returns empty history for new user', async () => {
    const res = await request(app)
      .get('/api/quiz/history')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});