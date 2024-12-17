import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create')
  createQuiz(@Body() body: { quizId: string; duration: number }): any {
    return this.quizService.createQuiz(body.quizId, body.duration);
  }

  @Get('quizzes')
  getQuizzes(): any {
    return this.quizService.getQuizzes();
  }

  @Post(':quizId/start')
  startQuiz(@Param('quizId') quizId: string): any {
    return this.quizService.startQuiz(quizId);
  }

  @Post(':quizId/submit')
  submitAnswers(
    @Param('quizId') quizId: string,
    @Body()
    body: {
      username: string;
      answers: { questionId: number; answer: string }[];
    },
  ): any {
    return this.quizService.submitAnswers(quizId, body.username, body.answers);
  }

  @Get(':quizId')
  getQuiz(
    @Param('quizId') quizId: string,
    @Query('username') username: string,
  ): any {
    return this.quizService.getQuiz(quizId, username);
  }
}
