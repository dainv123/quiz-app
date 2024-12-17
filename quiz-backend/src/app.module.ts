import { Module } from '@nestjs/common';
import { QuizGateway } from './module/quiz/quiz.gateway';
import { QuizService } from './module/quiz/quiz.service';
import { QuizController } from './module/quiz/quiz.controller';

@Module({
  imports: [],
  controllers: [QuizController],
  providers: [QuizService, QuizGateway],
})
export class AppModule {}
