import React from "react";

interface LeaderboardEntry {
  username: string;
  score: number;
}

interface QuizCardProps {
  quizId: string;
  leaderboard: LeaderboardEntry[];
}

const QuizCard: React.FC<QuizCardProps> = ({ quizId, leaderboard }) => {
  return (
    <div className="card mb-2 p-2">
      <p className="mb-0 ps-2">Quiz ID: {quizId}</p>
      <ul className="mb-0">
        {leaderboard.map((entry) => (
          <li key={entry.username}>
            {entry.username}: {entry.score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizCard;
