import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

describe('QuizController', () => {
  let quizController: QuizController;
  let quizService: QuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: QuizService,
          useValue: {
            createQuiz: jest.fn(),
            getQuizzes: jest.fn(),
            startQuiz: jest.fn(),
            submitAnswers: jest.fn(),
            getQuiz: jest.fn(),
          },
        },
      ],
    }).compile();

    quizController = module.get<QuizController>(QuizController);
    quizService = module.get<QuizService>(QuizService);
  });

  describe('createQuiz', () => {
    it('should call QuizService.createQuiz with correct arguments', () => {
      const body = { quizId: 'quiz123', duration: 60 };
      quizService.createQuiz = jest.fn().mockReturnValue('Quiz Created');

      const result = quizController.createQuiz(body);

      expect(quizService.createQuiz).toHaveBeenCalledWith(
        body.quizId,
        body.duration,
      );
      expect(result).toBe('Quiz Created');
    });
  });
});
