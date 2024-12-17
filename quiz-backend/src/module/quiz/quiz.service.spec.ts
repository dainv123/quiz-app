import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { QuizGateway } from './quiz.gateway';
import { NotFoundException } from '@nestjs/common';

describe('QuizService', () => {
  let quizService: QuizService;
  let quizGateway: QuizGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizService, QuizGateway],
    }).compile();

    quizService = module.get<QuizService>(QuizService);
    quizGateway = module.get<QuizGateway>(QuizGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createQuiz', () => {
    it('should create a new quiz', () => {
      const quizId = '123';
      const duration = 10;

      const createdQuiz = quizService.createQuiz(quizId, duration);

      expect(createdQuiz).toMatchObject({
        quizId,
        duration,
        isActive: false,
        questions: expect.any(Array),
        leaderboard: {},
        endTime: null,
      });

      expect(quizService.getQuizzes()[quizId]).toBeDefined();
    });

    it('should throw an error if quiz already exists', () => {
      const quizId = '123';
      const duration = 10;

      quizService.createQuiz(quizId, duration);

      expect(() => quizService.createQuiz(quizId, duration)).toThrow(
        NotFoundException,
      );
    });
  });
});
