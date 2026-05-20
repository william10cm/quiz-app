CREATE TABLE attempt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  selected_option_id UUID REFERENCES options(id),
  is_correct BOOLEAN NOT NULL
);