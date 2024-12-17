import React from "react";
import { Question } from "../../interface/quiz";
import Timer from "../Timer/Timer";
import QuizQuestion from "../QuizQuestion/QuizQuestion";

interface QuestionFormProps {
  setAnswers: (answers: Record<number, string>) => void;
  handleSubmitAnswers: () => void;
  timeRemaining: number;
  questions: Question[];
  answers: Record<number, string>;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  setAnswers,
  handleSubmitAnswers,
  timeRemaining,
  questions,
  answers,
}) => {
  const triggerSubmitAnswers = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleSubmitAnswers();
  };

  return (
    <form className="card mb-4 p-4" onSubmit={triggerSubmitAnswers}>
      <div className="d-flex justify-content-between mb-4">
        <h4>Questions</h4>
        <h4>
          <Timer timeRemaining={timeRemaining} />
        </h4>
      </div>

      {questions?.map((q) => (
        <QuizQuestion
          key={q.id}
          question={q.question}
          options={q.options}
          questionId={q.id}
          answers={answers}
          setAnswers={setAnswers}
        />
      ))}

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary" data-testid="submit-answer-btn">
          Submit Answers
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
