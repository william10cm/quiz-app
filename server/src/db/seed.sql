INSERT INTO topics (name, description) VALUES
('JavaScript', 'Core JavaScript concepts and programming fundamentals');

INSERT INTO questions (topic_id, question_text, difficulty) VALUES
(1, 'What is the output of typeof null in JavaScript?', 'easy'),
(1, 'Which method removes the last element from an array and returns it?', 'easy'),
(1, 'What does the "==" operator do differently from "==="?', 'easy'),
(1, 'What is a closure in JavaScript?', 'medium'),
(1, 'What is the difference between let, var, and const?', 'medium'),
(1, 'What will "0 == false" evaluate to in JavaScript?', 'medium'),
(1, 'What is the event loop in JavaScript?', 'hard'),
(1, 'What is the difference between Promise.all and Promise.allSettled?', 'hard'),
(1, 'Explain prototypal inheritance in JavaScript.', 'hard'),
(1, 'What does the "this" keyword refer to in an arrow function?', 'medium');

INSERT INTO options (question_id, option_text, is_correct)
SELECT q.id, o.option_text, o.is_correct FROM questions q
JOIN (VALUES
  ('What is the output of typeof null in JavaScript?', '"object"', true),
  ('What is the output of typeof null in JavaScript?', '"null"', false),
  ('What is the output of typeof null in JavaScript?', '"undefined"', false),
  ('What is the output of typeof null in JavaScript?', '"string"', false),

  ('Which method removes the last element from an array and returns it?', 'pop()', true),
  ('Which method removes the last element from an array and returns it?', 'push()', false),
  ('Which method removes the last element from an array and returns it?', 'shift()', false),
  ('Which method removes the last element from an array and returns it?', 'splice()', false),

  ('What does the "==" operator do differently from "==="?', 'It converts types before comparing', true),
  ('What does the "==" operator do differently from "==="?', 'It checks reference equality', false),
  ('What does the "==" operator do differently from "==="?', 'It only works with numbers', false),
  ('What does the "==" operator do differently from "==="?', 'There is no difference', false),

  ('What is a closure in JavaScript?', 'A function that retains access to its outer scope', true),
  ('What is a closure in JavaScript?', 'A way to close a browser window', false),
  ('What is a closure in JavaScript?', 'A method to end a loop early', false),
  ('What is a closure in JavaScript?', 'A type of error handler', false),

  ('What is the difference between let, var, and const?', 'let and const are block-scoped; var is function-scoped', true),
  ('What is the difference between let, var, and const?', 'var and const are block-scoped; let is global', false),
  ('What is the difference between let, var, and const?', 'They are all identical', false),
  ('What is the difference between let, var, and const?', 'const can be reassigned; let cannot', false),

  ('What will "0 == false" evaluate to in JavaScript?', 'true', true),
  ('What will "0 == false" evaluate to in JavaScript?', 'false', false),
  ('What will "0 == false" evaluate to in JavaScript?', 'undefined', false),
  ('What will "0 == false" evaluate to in JavaScript?', 'NaN', false),

  ('What is the event loop in JavaScript?', 'A mechanism that handles async operations via a call stack and queue', true),
  ('What is the event loop in JavaScript?', 'A for loop that runs infinitely', false),
  ('What is the event loop in JavaScript?', 'A built-in method for DOM events', false),
  ('What is the event loop in JavaScript?', 'A way to handle CSS animations', false),

  ('What is the difference between Promise.all and Promise.allSettled?', 'Promise.all rejects if any promise fails; allSettled waits for all', true),
  ('What is the difference between Promise.all and Promise.allSettled?', 'They are identical', false),
  ('What is the difference between Promise.all and Promise.allSettled?', 'Promise.allSettled rejects on first failure', false),
  ('What is the difference between Promise.all and Promise.allSettled?', 'Promise.all only works with two promises', false),

  ('Explain prototypal inheritance in JavaScript.', 'Objects inherit directly from other objects via the prototype chain', true),
  ('Explain prototypal inheritance in JavaScript.', 'It is the same as classical class-based inheritance', false),
  ('Explain prototypal inheritance in JavaScript.', 'It uses the extends keyword exclusively', false),
  ('Explain prototypal inheritance in JavaScript.', 'JavaScript does not support inheritance', false),

  ('What does the "this" keyword refer to in an arrow function?', 'The enclosing lexical scope', true),
  ('What does the "this" keyword refer to in an arrow function?', 'The arrow function itself', false),
  ('What does the "this" keyword refer to in an arrow function?', 'The global window object always', false),
  ('What does the "this" keyword refer to in an arrow function?', 'undefined always', false)
) AS o(question_text, option_text, is_correct)
ON q.question_text = o.question_text;