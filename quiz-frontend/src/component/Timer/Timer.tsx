import React, { useEffect, useState } from "react";

const Timer: React.FC<{ timeRemaining: number }> = ({ timeRemaining }) => {
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    setTime(timeRemaining);

    const interval = setInterval(() => {
      setTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  return <>In {time}(s)</>;
};

export default Timer;
