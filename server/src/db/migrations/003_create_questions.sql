CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id INT REFERENCES topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);