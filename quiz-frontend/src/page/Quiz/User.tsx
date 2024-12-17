import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Leaderboard from "../../component/Leaderboard/Leaderboard";
import JoinQuizForm from "../../component/JoinQuizForm/JoinQuizForm";
import QuestionForm from "../../component/QuestionForm/QuestionForm";
import { getQuiz, submitAnswers, socket } from "../../helper/api";
import { LEADERBOARD_UPDATE, QUIZ_END, QUIZ_UPDATE, TIME_REMAINING } from "../../constant/socket-event";

const QuizUser: React.FC = () => {
  const [quizId, setQuizId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const handleSocketUpdate = () => {
      socket.on(QUIZ_UPDATE, (data: any) => {
        if (data.quizId === quizId) {
          setQuestions(data.questions);
          setTimeRemaining(data.remainingTime);
        }
      });

      socket.on(LEADERBOARD_UPDATE, (data: any) => {
        if (data.quizId === quizId) {
          setLeaderboard(data.leaderboard);
        }
      });

      socket.on(TIME_REMAINING, (data: any) => {
        if (data.quizId === quizId && !isSubmited) {
          setTimeRemaining(data.remainingTime);
          toast.info(`The exam will end in ${data.remainingTime} seconds!`);
        }
      });

      socket.on(QUIZ_END, (data: any) => {
        if (data.quizId === quizId) {
          toast.info("The quiz has ended!");
          setIsSubmited(true);
        }
      });
    };

    handleSocketUpdate();

    return () => {
      socket.off(QUIZ_END);
      socket.off(QUIZ_UPDATE);
      socket.off(TIME_REMAINING);
      socket.off(LEADERBOARD_UPDATE);
    };
  }, [quizId, isSubmited]);

  const handleJoinQuiz = async () => {
    try {
      const response = await getQuiz(quizId, username);
      setIsJoined(true);
      setIsSubmited(response.data.isSubmited);
      setLeaderboard(response.data.leaderboard);
      if (response.data.isActive) {
        setQuestions(response.data.questions);
        setTimeRemaining(response.data.remainingTime);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleSubmitAnswers = async () => {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        questionId: Number(questionId),
        answer,
      })
    );

    try {
      await submitAnswers(quizId, username, formattedAnswers);
      setIsSubmited(true);
      toast.success("Answers submitted!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to submit answers!"
      );
    }
  };

  return (
    <div>
      <h1 className="mb-4">Quiz User</h1>
      {!isJoined ? (
        <JoinQuizForm
          setQuizId={setQuizId}
          setUsername={setUsername}
          handleJoinQuiz={handleJoinQuiz}
        />
      ) : (
        <>
          <div className="card mb-4 p-4">
            <h5>Quiz ID: {quizId}</h5>
            <h5>Username: {username}</h5>
          </div>
          <Leaderboard leaderboard={leaderboard} />
          {isSubmited ? (
            <div className="card mb-4 p-4">You are done</div>
          ) : !questions?.length ? (
            <div className="card mb-4 p-4">Please wait...</div>
          ) : (
            <QuestionForm
              answers={answers}
              questions={questions}
              timeRemaining={timeRemaining}
              setAnswers={setAnswers}
              handleSubmitAnswers={handleSubmitAnswers}
            />
          )}
        </>
      )}
    </div>
  );
};

export default QuizUser;
