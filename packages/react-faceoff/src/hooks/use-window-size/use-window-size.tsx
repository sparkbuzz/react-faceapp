type WindowSize = {
  height: number,
  width: number
}

const useWindowSize = (): WindowSize => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

export { useWindowSize };
export type { WindowSize };
