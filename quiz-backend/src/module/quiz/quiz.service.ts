import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { QuizGateway } from './quiz.gateway';
import { Question, Quiz } from 'src/interface/quiz';
import {LEADERBOARD_UPDATE, QUIZ_END, QUIZ_UPDATE, TIME_REMAINING } from 'src/constant/socket-event';

interface LeaderboardEntry {
  score: number;
  submittedAt: Date;
}

@Injectable()
export class QuizService {
  private quizzes: Record<string, Quiz> = {};

  private mockedQuestions: Question[] = [
    {
      id: 1,
      question: 'What is 2 + 2?',
      options: ['3', '4', '5'],
      correctAnswer: '4',
    },
    {
      id: 2,
      question: 'What is 3 + 3?',
      options: ['5', '6', '7'],
      correctAnswer: '6',
    },
  ];

  constructor(private readonly quizGateway: QuizGateway) {}

  private sortLeaderboard(leaderboard: Record<string, LeaderboardEntry>) {
    return Object.entries(leaderboard)
      .map(([username, user]) => ({
        username,
        score: user.score,
        submittedAt: user.submittedAt,
      }))
      .sort((a, b) => {
        if (b.score === a.score) {
          return a.submittedAt.getTime() - b.submittedAt.getTime();
        }
        return b.score - a.score;
      });
  }

  createQuiz(quizId: string, duration: number) {
    if (this.quizzes[quizId]) {
      throw new NotFoundException(`Quiz with ID ${quizId} already exists.`);
    }

    this.quizzes[quizId] = {
      quizId,
      duration,
      questions: this.mockedQuestions,
      leaderboard: {},
      isActive: false,
      endTime: null,
    };

    return this.quizzes[quizId];
  }

  startQuiz(quizId: string) {
    const quiz = this.quizzes[quizId];
    if (!quiz) throw new NotFoundException(`Quiz with ID ${quizId} not found.`);
    if (quiz.isActive) throw new NotFoundException(`Quiz is already started.`);

    quiz.isActive = true;
    quiz.endTime = new Date(Date.now() + quiz.duration * 60 * 1000);

    this.quizGateway.server.emit(QUIZ_UPDATE, {
      quizId,
      remainingTime: quiz.duration * 60,
      questions: quiz.questions,
    });

    this.startReminder(quizId);
  }

  startReminder(quizId: string) {
    const quiz = this.quizzes[quizId];
    let isTriggerWarning = false;

    const interval = setInterval(() => {
      const remainingSeconds = Math.floor(
        Math.max(quiz.endTime.getTime() - Date.now(), 0) / 1000,
      );

      // Sync timer at last 30s
      if (remainingSeconds <= 30 && !isTriggerWarning) {
        isTriggerWarning = true;
        this.notifyTimeRemaining(quizId, remainingSeconds);
      }

      if (remainingSeconds <= 0) {
        this.endQuiz(quizId);
        clearInterval(interval);
      }
    }, 1000);
  }

  notifyTimeRemaining(quizId: string, remainingTime: number) {
    this.quizGateway.server.emit(TIME_REMAINING, { quizId, remainingTime });
  }

  getQuiz(quizId: string, username?: string) {
    const quiz = this.quizzes[quizId];
    if (!quiz) throw new NotFoundException(`Quiz with ID ${quizId} not found.`);

    let remainingTime = quiz.duration;
    let questions = null;
    let leaderboard = this.sortLeaderboard(quiz.leaderboard);

    let isSubmitted = false;
    if (quiz.leaderboard[username]) {
      isSubmitted = true;
    } else if (quiz.isActive) {
      // Update data for late user login, login after the quiz is started
      questions = quiz.questions;
      remainingTime = Math.floor(
        Math.max(quiz.endTime.getTime() - Date.now(), 0) / 1000,
      );
    }

    return {
      quizId: quiz.quizId,
      isActive: quiz.isActive,
      duration: quiz.duration,
      questions,
      remainingTime,
      leaderboard,
      isSubmitted,
    };
  }

  submitAnswers(
    quizId: string,
    username: string,
    answers: { questionId: number; answer: string }[],
  ) {
    const quiz = this.quizzes[quizId];
    if (!quiz) throw new NotFoundException(`Quiz with ID ${quizId} not found.`);
    if (!quiz.isActive) throw new NotFoundException(`Quiz is not active.`);
    if (quiz.leaderboard[username])
      throw new ConflictException(`This user has already submitted.`);

    let score = 0;
    answers.forEach((ans) => {
      const question = quiz.questions.find((q) => q.id === ans.questionId);
      if (question && question.correctAnswer === ans.answer) {
        score++;
      }
    });

    quiz.leaderboard[username] = {
      score,
      submittedAt: new Date(),
    };

    this.notifyLeaderboardUpdate(quizId);
  }

  notifyLeaderboardUpdate(quizId: string) {
    const quiz = this.quizzes[quizId];
    const leaderboard = this.sortLeaderboard(quiz.leaderboard);
    this.quizGateway.server.emit(LEADERBOARD_UPDATE, { quizId, leaderboard });
  }

  getQuizzes() {
    return this.quizzes;
  }

  endQuiz(quizId: string) {
    const quiz = this.quizzes[quizId];
    if (!quiz) throw new NotFoundException(`Quiz with ID ${quizId} not found.`);
    quiz.isActive = false;

    this.quizGateway.server.emit(QUIZ_END, { quizId });
  }
}
