import React, { useEffect } from "react";

interface TimerProps {
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, setTimeLeft }) => {
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime: number) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  return (
    <div>
      <div className="text-1xl font-semibold text-orange-600">{timeLeft > 0 ? `${timeLeft} seconds left` : "Time's up!"}</div>
    </div>
  );
};

export default Timer;
