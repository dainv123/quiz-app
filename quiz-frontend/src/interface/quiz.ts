export interface LeaderboardEntry {
  username: string;
  score: number;
}

export interface Leaderboard {
  [userId: string]: { score: number };
}

export interface Quiz {
  id: string;
  title: string;
  duration: number;
  leaderboard?: Leaderboard;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
}
