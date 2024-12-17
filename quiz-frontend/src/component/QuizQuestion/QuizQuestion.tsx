import React from "react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  questionId: number;
  answers: Record<number, string>;
  setAnswers: (answers: Record<number, string>) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  questionId,
  answers,
  setAnswers,
}) => (
  <div className="mb-4">
    <p>{question}</p>
    <div className="form-check">
      {options.map((option) => (
        <div key={option} className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id={`question-${questionId}-option-${option}`}
            name={`question-${questionId}`}
            value={option}
            onChange={(e) =>
              setAnswers({ ...answers, [questionId]: e.target.value })
            }
          />
          <label
            htmlFor={`question-${questionId}-option-${option}`}
            className="form-check-label"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  </div>
);

export default QuizQuestion;
