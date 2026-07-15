import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopics } from '../services/quizService';
import './TopicPage.css';

interface Topic {
  id: number;
  name: string;
  description: string;
}

const TopicPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTopics()
      .then((res) => setTopics(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <h1 className="topic-heading">Choose a topic</h1>
      <p className="topic-sub">Select a topic to start your quiz</p>
      {loading ? (
        <p className="topic-loading">Loading topics...</p>
      ) : (
        <div className="topic-grid">
          {topics.map((topic) => (
            <button
              key={topic.id}
              className="topic-card"
              onClick={() => navigate(`/quiz/${topic.id}`)}
            >
              <span className="topic-name">{topic.name}</span>
              <span className="topic-desc">{topic.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicPage;