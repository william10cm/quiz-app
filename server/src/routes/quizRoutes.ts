import { Router } from 'express';
import {
  getTopics,
  getQuestions,
  submitQuiz,
  getHistory,
} from '../controllers/quizController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/topics', authMiddleware, getTopics);
router.get('/history', authMiddleware, getHistory);
router.post('/submit', authMiddleware, submitQuiz);
router.get('/:topicId', authMiddleware, getQuestions);

export default router;