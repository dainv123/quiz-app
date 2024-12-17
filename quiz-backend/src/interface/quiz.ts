export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  quizId: string;
  duration: number;
  questions: Question[];
  leaderboard: Record<string, { score: number; submittedAt: Date }>;
  isActive: boolean;
  endTime: Date | null;
}
