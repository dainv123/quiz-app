import React from "react";
import QuizCard from "../QuizCard/QuizCard";
import { Quiz } from "../../interface/quiz";

interface QuizzesListProps {
  quizzes: Record<string, Quiz>;
}

const QuizzesList: React.FC<QuizzesListProps> = ({ quizzes }) => {
  return (
    <div className="card mb-4 p-4">
      <h3 className="mb-3">Quizz(es)</h3>
      {Object.entries(quizzes).length === 0 ? (
        <p>No quizzes available</p>
      ) : (
        Object.entries(quizzes).map(([key, quiz]) => (
          <QuizCard
            key={key}
            quizId={key}
            leaderboard={Object.entries(quiz.leaderboard || {}).map(
              ([username, { score }]) => ({
                username,
                score,
              })
            )}
          />
        ))
      )}
    </div>
  );
};

export default QuizzesList;
