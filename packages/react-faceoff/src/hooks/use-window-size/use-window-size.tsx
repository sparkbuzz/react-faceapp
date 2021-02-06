import { useEffect, useState } from 'react';
import { debounce } from 'debounce';

type WindowSize = {
  height: number,
  width: number
}

const DEBOUNCE_TIMEOUT_MS = 200;

let hasResizeListener: boolean = false;

const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleWindowResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, DEBOUNCE_TIMEOUT_MS);

    if (!hasResizeListener) {
      window.addEventListener('resize', handleWindowResize);
      hasResizeListener = true;
    }
  }, []);

  return windowSize;
}

export { useWindowSize };
export type { WindowSize };
