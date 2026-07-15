import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions, submitQuiz } from '../services/quizService';
import './QuizPage.css';

interface Option { id: string; option_text: string; }
interface Question { id: string; question_text: string; difficulty: string; options: Option[]; }

const QuizPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getQuestions(Number(topicId))
      .then((res) => setQuestions(res.data))
      .finally(() => setLoading(false));
  }, [topicId]);

  const handleSelect = (questionId: string, optionId: string) => {
    setSelected((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answers = Object.entries(selected).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));
      const res = await submitQuiz(Number(topicId), answers);
      navigate('/results', { state: { result: res.data } });
    } catch {
      // submission failed
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-container"><p className="quiz-loading">Loading questions...</p></div>;

  const question = questions[current];
  const answered = Object.keys(selected).length;
  const allAnswered = answered === questions.length;

  return (
    <div className="page-container">
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>
      <div className="quiz-meta">
        <span className="quiz-counter">Question {current + 1} of {questions.length}</span>
        <span className={`quiz-difficulty quiz-difficulty--${question.difficulty}`}>
          {question.difficulty}
        </span>
      </div>
      <div className="quiz-card">
        <p className="quiz-question">{question.question_text}</p>
        <div className="quiz-options">
          {question.options.map((option) => (
            <button
              key={option.id}
              className={`quiz-option ${selected[question.id] === option.id ? 'quiz-option--selected' : ''}`}
              onClick={() => handleSelect(question.id, option.id)}
            >
              {option.option_text}
            </button>
          ))}
        </div>
      </div>
      <div className="quiz-nav">
        <button className="btn-secondary" onClick={handlePrev} disabled={current === 0}>
          Previous
        </button>
        <span className="quiz-answered">{answered}/{questions.length} answered</span>
        {current < questions.length - 1 ? (
          <button className="btn-secondary" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} disabled={!allAnswered || submitting}>
            {submitting ? 'Submitting...' : 'Submit quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;