import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../services/quizService';
import './DashboardPage.css';

interface Attempt {
  id: string;
  score: number;
  total_questions: number;
  percentage: string;
  taken_at: string;
  topic_name: string;
}

const DashboardPage = () => {
  const [history, setHistory] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avgScore = history.length
    ? Math.round(history.reduce((sum, a) => sum + Number(a.percentage), 0) / history.length)
    : 0;

  return (
    <div className="page-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-sub">Welcome back, {user?.username}</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-label">Quizzes taken</span>
          <span className="stat-value">{history.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average score</span>
          <span className="stat-value">{avgScore}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Best score</span>
          <span className="stat-value">
            {history.length ? Math.max(...history.map((a) => Number(a.percentage))) : 0}%
          </span>
        </div>
      </div>

      <div className="dashboard-history">
        <div className="dashboard-history-header">
          <h2 className="dashboard-history-title">Recent attempts</h2>
          <button className="btn-primary" onClick={() => navigate('/topics')}>
            New quiz
          </button>
        </div>
        {loading ? (
          <p className="dashboard-loading">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="dashboard-empty">No quizzes taken yet. Start one!</p>
        ) : (
          <div className="history-list">
            {history.map((attempt) => (
              <div key={attempt.id} className="history-row">
                <div className="history-info">
                  <span className="history-topic">{attempt.topic_name}</span>
                  <span className="history-date">
                    {new Date(attempt.taken_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="history-score">
                  <span className={`history-pct ${Number(attempt.percentage) >= 60 ? 'history-pct--pass' : 'history-pct--fail'}`}>
                    {attempt.percentage}%
                  </span>
                  <span className="history-tally">{attempt.score}/{attempt.total_questions}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;