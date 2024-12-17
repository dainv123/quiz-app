import React from "react";
import { render, screen } from "@testing-library/react";
import QuizUser from "./User";

jest.mock("axios");
describe("QuizUser", () => {
  beforeEach(() => jest.clearAllMocks());

  test("should render JoinQuizForm when not joined", () => {
    render(<QuizUser />);
    expect(screen.getByText(/Quiz User/)).toBeInTheDocument();
    expect(screen.getByText(/Quiz ID/)).toBeInTheDocument();
    expect(screen.getByText(/Username/)).toBeInTheDocument();
  });
});
