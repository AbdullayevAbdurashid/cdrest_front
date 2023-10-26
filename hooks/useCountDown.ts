import { useEffect, useRef, useState } from 'react';

export const useCountDown: (
  total: number,
  ms?: number,
) => [number, () => void, () => void, () => void] = (
  total: number,
  ms: number = 1000,
) => {
  const [counter, setCountDown] = useState(total);
  const [startCountDown, setStartCountDown] = useState(false);
  const intervalId = useRef<NodeJS.Timer>();
  const start: () => void = () => setStartCountDown(true);
  const pause: () => void = () => setStartCountDown(false);
  const reset: () => void = () => {
    clearInterval(intervalId.current);
    setStartCountDown(false);
    setCountDown(total);
  };

  useEffect(() => {
    intervalId.current = setInterval(() => {
      startCountDown && counter > 0 && setCountDown(counter => counter - 1);
    }, ms);
    if (counter === 0) clearInterval(intervalId.current);
    return () => clearInterval(intervalId.current);
  }, [startCountDown, counter, ms]);

  return [counter, start, pause, reset];
};