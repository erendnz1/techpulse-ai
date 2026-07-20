"use client";

import SourceCard from "./SourceCard";

type Props = {
  sources: Record<string, number>;
};

export default function SourceList({ sources }: Props) {
  const items = Object.entries(sources)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map(([name, count]) => (
        <SourceCard
          key={name}
          name={name}
          count={count}
        />
      ))}
    </div>
  );
}