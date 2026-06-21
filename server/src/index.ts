import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import './db';
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Quiz App API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});