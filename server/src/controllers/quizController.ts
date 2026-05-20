/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import pool from '../db';
import { SubmitAnswerPayload } from '../types/quiz';

export const getTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM topics ORDER BY id');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getTopics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  const { topicId } = req.params;

  try {
    // Get 10 random questions for the topic
    const questionsResult = await pool.query(
      `SELECT id, question_text, difficulty
       FROM questions
       WHERE topic_id = $1
       ORDER BY RANDOM()
       LIMIT 10`,
      [topicId]
    );

    if (questionsResult.rows.length === 0) {
      res.status(404).json({ message: 'No questions found for this topic' });
      return;
    }

    // Get options for each question (without revealing is_correct)
    const questionsWithOptions = await Promise.all(
      questionsResult.rows.map(async (question) => {
        const optionsResult = await pool.query(
          `SELECT id, option_text
           FROM options
           WHERE question_id = $1
           ORDER BY RANDOM()`,
          [question.id]
        );
        return {
          ...question,
          options: optionsResult.rows,
        };
      })
    );

    res.status(200).json(questionsWithOptions);
  } catch (error) {
    console.error('getQuestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
  const { topicId, answers }: SubmitAnswerPayload = req.body;
  const userId = req.user?.id;

  try {
    // Get the correct options for all submitted questions
    const questionIds = answers.map((a) => a.questionId);
    const correctOptions = await pool.query(
      `SELECT question_id, id as correct_option_id
       FROM options
       WHERE question_id = ANY($1::uuid[]) AND is_correct = true`,
      [questionIds]
    );

    // Build a lookup map: questionId -> correctOptionId
    const correctMap: Record<string, string> = {};
    correctOptions.rows.forEach((row) => {
      correctMap[row.question_id] = row.correct_option_id;
    });

    // Score the answers
    const results = answers.map((answer) => {
      const correctOptionId = correctMap[answer.questionId];
      const isCorrect = answer.selectedOptionId === correctOptionId;
      return {
        questionId: answer.questionId,
        correct: isCorrect,
        correctOptionId,
        selectedOptionId: answer.selectedOptionId,
      };
    });

    const score = results.filter((r) => r.correct).length;
    const total = answers.length;
    const percentage = Math.round((score / total) * 100);

    // Save the attempt to the database
    const attemptResult = await pool.query(
      `INSERT INTO quiz_attempts (user_id, topic_id, score, total_questions)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [userId, topicId, score, total]
    );

    const attemptId = attemptResult.rows[0].id;

    // Save each individual answer
    await Promise.all(
      results.map((r) =>
        pool.query(
          `INSERT INTO attempt_answers
           (attempt_id, question_id, selected_option_id, is_correct)
           VALUES ($1, $2, $3, $4)`,
          [attemptId, r.questionId, r.selectedOptionId, r.correct]
        )
      )
    );

    res.status(200).json({
      score,
      total,
      percentage,
      results,
    });
  } catch (error) {
    console.error('submitQuiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    const result = await pool.query(
      `SELECT
         qa.id,
         qa.score,
         qa.total_questions,
         ROUND((qa.score::decimal / qa.total_questions) * 100) AS percentage,
         qa.taken_at,
         t.name AS topic_name
       FROM quiz_attempts qa
       JOIN topics t ON t.id = qa.topic_id
       WHERE qa.user_id = $1
       ORDER BY qa.taken_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getHistory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};