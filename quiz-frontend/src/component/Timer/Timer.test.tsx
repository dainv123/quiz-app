import React from "react";
import Timer from "./Timer";
import { render, screen, act } from "@testing-library/react";

jest.useFakeTimers();

describe("Timer", () => {
  it("renders the initial time correctly", () => {
    render(<Timer timeRemaining={10} />);
    expect(screen.getByText("In 10(s)")).toBeInTheDocument();
  });

  it("decrements the time every second", () => {
    render(<Timer timeRemaining={5} />);

    expect(screen.getByText("In 5(s)")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("In 4(s)")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.getByText("In 0(s)")).toBeInTheDocument();
  });
});
