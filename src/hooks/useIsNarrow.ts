"use client";

import { useEffect, useState } from "react";

const BREAKPOINT = 900;

export function useIsNarrow(): boolean {
  const [isNarrow, setIsNarrow] = useState(true);

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isNarrow;
}
