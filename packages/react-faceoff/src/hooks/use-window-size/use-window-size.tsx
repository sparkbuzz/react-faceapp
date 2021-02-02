import { useEffect, useState } from 'react';
import { debounce } from 'debounce';

type WindowSize = {
  height: number,
  width: number
}

const DEBOUNCE_TIMEOUT_MS = 200;

const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const handleWindowResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, DEBOUNCE_TIMEOUT_MS);

    window.addEventListener('resize', handleWindowResize);
  }, []);

  return windowSize;
}

export { useWindowSize };
export type { WindowSize };
