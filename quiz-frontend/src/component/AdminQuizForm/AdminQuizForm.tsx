import React, { memo } from "react";

interface AdminQuizFormProps {
  setQuizId: (e: string) => void;
  setDuration: (e: number) => void;
  onStartQuiz: () => void;
  onCreateQuiz: () => void;
}

const AdminQuizForm: React.FC<AdminQuizFormProps> = ({
  setQuizId,
  setDuration,
  onCreateQuiz,
  onStartQuiz,
}) => {
  const handleCreateQuiz = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onCreateQuiz();
  };

  return (
    <form className="card mb-4 p-4" onSubmit={handleCreateQuiz}>
      <div className="form-group mb-3">
        <label className="form-label">Quiz ID</label>
        <input
          className="form-control"
          required
          type="text"
          placeholder="Enter Quiz ID"
          onChange={(e) => setQuizId(e.target.value)}
        />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Duration (minutes)</label>
        <input
          className="form-control"
          required
          type="number"
          placeholder="Duration (minutes)"
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary me-2">
          Create Quiz
        </button>
        <button type="button" onClick={onStartQuiz} className="btn btn-success">
          Start Quiz
        </button>
      </div>
    </form>
  );
};

export default memo(AdminQuizForm);
