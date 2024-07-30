import React from "react";

interface Props {
  name: string;
  value: string;
}

export default function Stats(props: Props) {
  const { name, value } = props;

  return (
    <div className="flex flex-col gap-2 rounded bg-white p-4">
      <span className="text-xs">{name}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
