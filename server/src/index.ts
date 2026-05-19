import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Quiz App API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});