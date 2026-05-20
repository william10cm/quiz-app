import api from './api';

export const getTopics = () =>
  api.get('/api/quiz/topics');

export const getQuestions = (topicId: number) =>
  api.get(`/api/quiz/${topicId}`);

export const submitQuiz = (topicId: number, answers: { questionId: string; selectedOptionId: string }[]) =>
  api.post('/api/quiz/submit', { topicId, answers });

export const getHistory = () =>
  api.get('/api/quiz/history');