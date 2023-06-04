import { useEffect, useState } from 'react';

const useCounter = (
  initialValue: number,
  isPlaying: boolean,
  isFailing: boolean,
  isWinning: boolean
) => {
  // Time counter after the game is played
  const [counter, setCounter] = useState(initialValue);

  // Counter time interval for each second
  useEffect(() => {
    if (counter < 999 && isPlaying && !isFailing && !isWinning) {
      const timer = setTimeout(() => setCounter(counter + 1), 1000);
      return () => clearInterval(timer as NodeJS.Timeout);
    }
  }, [counter, isPlaying, isFailing, isWinning]);

  return counter;
};

export default useCounter;
