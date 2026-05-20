import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import './db';
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Quiz App API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});