import { useLocation, useNavigate } from 'react-router-dom';
import './ResultsPage.css';

interface Result {
  questionId: string;
  correct: boolean;
  correctOptionId: string;
  selectedOptionId: string;
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  results: Result[];
}

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result: QuizResult = location.state?.result;

  if (!result) {
    navigate('/topics');
    return null;
  }

  const passed = result.percentage >= 60;

  return (
    <div className="page-container">
      <div className={`results-banner ${passed ? 'results-banner--pass' : 'results-banner--fail'}`}>
        <h1 className="results-score">{result.percentage}%</h1>
        <p className="results-label">{passed ? 'Great job!' : 'Keep practicing!'}</p>
        <p className="results-tally">{result.score} out of {result.total} correct</p>
      </div>
      <div className="results-breakdown">
        <h2 className="results-breakdown-title">Breakdown</h2>
        {result.results.map((r, i) => (
          <div key={r.questionId} className={`result-row ${r.correct ? 'result-row--correct' : 'result-row--wrong'}`}>
            <span className="result-row-icon">{r.correct ? '✓' : '✗'}</span>
            <span className="result-row-label">Question {i + 1}</span>
          </div>
        ))}
      </div>
      <div className="results-actions">
        {/* <button className="btn-secondary" onClick={() => navigate('/topics')}>
          Try another topic
        // </button> */}
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
          View dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;