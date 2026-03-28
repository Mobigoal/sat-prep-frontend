export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'math' | 'reading' | 'writing';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizSession {
  id: string;
  questions: Question[];
  currentIndex: number;
  answers: number[];
  score: number;
  timeSpent: number;
}

export interface UserProgress {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  categoryScores: {
    math: number;
    reading: number;
    writing: number;
  };
}