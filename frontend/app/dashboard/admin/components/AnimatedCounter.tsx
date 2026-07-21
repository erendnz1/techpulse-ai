"use client";

import { useEffect, useState } from "react";

interface Props {
  value: number;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  duration = 1200,
}: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const increment = Math.max(1, Math.ceil(value / (duration / 16)));

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}