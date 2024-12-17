import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import AdminQuizForm from "../../component/AdminQuizForm/AdminQuizForm";
import Leaderboard from "../../component/Leaderboard/Leaderboard";
import QuizzesList from "../../component/QuizzesList/QuizzesList";
import { LeaderboardEntry, Quiz } from "../../interface/quiz";
import { socket, getQuizzes, createQuiz, startQuiz } from "../../helper/api";
import { LEADERBOARD_UPDATE } from "../../constant/socket-event";

const QuizAdmin: React.FC = () => {
  const [quizId, setQuizId] = useState<string>("");
  const [duration, setDuration] = useState<number>(5);
  const [quizzes, setQuizzes] = useState<Record<string, Quiz>>({});
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    socket.on(LEADERBOARD_UPDATE, (data: any) => {
      if (data.quizId === quizId) {
        setLeaderboard(data.leaderboard);
      }
    });

    return () => {
      socket.off(LEADERBOARD_UPDATE);
    };
  }, [quizId]);

  const handleCreateQuiz = useCallback(async () => {
    try {
      await createQuiz(quizId, duration);
      await fetchQuizzes();
      toast.success(`Quiz ${quizId} created successfully.`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create quiz.");
    }
  }, [quizId, duration]);

  const handleStartQuiz = useCallback(async () => {
    try {
      await startQuiz(quizId);
      toast.success("Quiz started!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to start quiz.");
    }
  }, [quizId]);

  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzes();
      setQuizzes(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch quiz.");
    }
  };

  return (
    <div>
      <h1 className="mb-4">Quiz Admin</h1>
      <AdminQuizForm
        setQuizId={setQuizId}
        setDuration={setDuration}
        onStartQuiz={handleStartQuiz}
        onCreateQuiz={handleCreateQuiz}
      />
      <div className="row">
        <div className="col-md-6 mb-12">
          <Leaderboard leaderboard={leaderboard} />
        </div>

        <div className="col-md-6 mb-12">
          <QuizzesList quizzes={quizzes} />
        </div>
      </div>
    </div>
  );
};

export default QuizAdmin;
