import React, { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import QuizAdmin from "./Admin";
import { getQuizzes } from "../../helper/api";

jest.mock("../../helper/api", () => ({
  socket: { on: jest.fn(), off: jest.fn() },
  getQuizzes: jest.fn(),
  createQuiz: jest.fn(),
  startQuiz: jest.fn(),
}));

describe("QuizAdmin", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    render(<QuizAdmin />);
    expect(screen.getByText(/Quiz Admin/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Quiz Admin/i })).toBeInTheDocument();
  });

  it("should fetch quizzes on component mount", async () => {
    const mockQuizzes = { quiz1: { id: "quiz1", duration: 5 } };
    (getQuizzes as jest.Mock).mockResolvedValue({ data: mockQuizzes });

    await act(async () => {
      render(<QuizAdmin />);
    });

    await waitFor(() => {
      expect(getQuizzes).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText(/Quiz Admin/i)).toBeInTheDocument();
  });
});
