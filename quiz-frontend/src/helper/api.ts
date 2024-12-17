import axios from "axios";
import { io } from "socket.io-client";
import { API_QUIZ_URL, SOCKET_BASE_URL } from "../constant/endpoint";

export const socket = io(SOCKET_BASE_URL);

export const createQuiz = (quizId: string, duration: number) =>
  axios.post(`${API_QUIZ_URL}/create`, { quizId, duration });

export const startQuiz = (quizId: string) =>
  axios.post(`${API_QUIZ_URL}/${quizId}/start`);

export const getQuiz = (quizId: string, username: string) =>
  axios.get(`${API_QUIZ_URL}/${quizId}?username=${username}`);

export const getQuizzes = () => axios.get(`${API_QUIZ_URL}/quizzes`);

export const submitAnswers = (
  quizId: string,
  username: string,
  answers: any[]
) => axios.post(`${API_QUIZ_URL}/${quizId}/submit`, { username, answers });
