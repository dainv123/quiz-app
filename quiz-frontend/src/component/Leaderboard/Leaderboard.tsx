import React from "react";
import { LeaderboardEntry } from "../../interface/quiz";

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
  return (
    <div className="card mb-4 p-4">
      <h4>Leaderboard [updating...]</h4>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.username}: {entry.score} points
          </li>
        ))}
      </ul>
    </div>
  )
};

export default Leaderboard;
