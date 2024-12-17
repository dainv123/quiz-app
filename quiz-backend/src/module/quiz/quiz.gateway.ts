import {
  MessageBody,
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Question } from 'src/interface/quiz';
import {
  LEADERBOARD_UPDATE,
  QUIZ_END,
  QUIZ_UPDATE,
  TIME_REMAINING,
} from 'src/constant/socket-event';

@WebSocketGateway({ cors: { origin: '*' } })
export class QuizGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(TIME_REMAINING)
  timeRemaining(
    @MessageBody() data: { quizId: string; remainingTime: number },
  ) {
    this.server.emit(TIME_REMAINING, data);
  }

  @SubscribeMessage(QUIZ_UPDATE)
  quizUpdate(
    @MessageBody()
    data: {
      quizId: string;
      remainingTime: number;
      questions: Question[];
    },
  ) {
    this.server.emit(QUIZ_UPDATE, data);
  }

  @SubscribeMessage(LEADERBOARD_UPDATE)
  leaderboardUpdate(
    @MessageBody()
    data: {
      quizId: string;
      leaderboard: Record<string, { score: number; submittedAt: Date }>;
    },
  ) {
    this.server.emit(LEADERBOARD_UPDATE, data);
  }

  @SubscribeMessage(QUIZ_END)
  quizEnded(@MessageBody() data: { quizId: string }) {
    this.server.emit(QUIZ_END, data);
  }
}
