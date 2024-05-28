"use client";

import { useEffect, useState } from "react";

export type WindowSize = {
  height: number;
  width: number;
};

export function getWindowSize(): WindowSize {
  return {
    width: typeof window !== undefined ? window.innerWidth : 0,
    height: typeof window !== undefined ? window.innerHeight : 0,
  };
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    height: 0,
    width: 0,
  });

  const handleResize = () => {
    setWindowSize(getWindowSize());
  };

  useEffect(() => {
    setWindowSize(getWindowSize());
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
