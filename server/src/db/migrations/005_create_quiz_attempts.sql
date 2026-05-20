CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id INT REFERENCES topics(id),
  score INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL,
  taken_at TIMESTAMP DEFAULT NOW()
);