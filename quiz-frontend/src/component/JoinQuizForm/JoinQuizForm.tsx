import React from "react";

interface JoinQuizFormProps {
  setQuizId: (value: string) => void;
  setUsername: (value: string) => void;
  handleJoinQuiz: () => void;
}

const JoinQuizForm: React.FC<JoinQuizFormProps> = ({
  setQuizId,
  setUsername,
  handleJoinQuiz,
}) => {
  const triggerJoinQuiz = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleJoinQuiz();
  };

  return (
    <form className="card mb-4 p-4" onSubmit={triggerJoinQuiz}>
      <div className="form-group mb-3">
        <label className="form-label">Quiz ID</label>
        <input
          data-testid="quizid-input"
          className="form-control"
          required
          type="text"
          placeholder="Enter Quiz ID"
          onChange={(e) => setQuizId(e.target.value)}
        />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Username</label>
        <input
          data-testid="username-input"
          className="form-control"
          required
          type="text"
          placeholder="Enter Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="d-flex justify-content-end">
        <button
          type="submit"
          className="btn btn-primary"
          data-testid="join-quiz-btn"
        >
          Join Quiz
        </button>
      </div>
    </form>
  );
};

export default JoinQuizForm;
