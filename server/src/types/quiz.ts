export interface Question {
  id: string;
  question_text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: Option[];
}

export interface Option {
  id: string;
  option_text: string;
}

export interface SubmitAnswerPayload {
  topicId: number;
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
}

export interface AttemptResult {
  score: number;
  total: number;
  percentage: number;
  results: {
    questionId: string;
    correct: boolean;
    correctOptionId: string;
    selectedOptionId: string;
  }[];
}