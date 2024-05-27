"use client";

import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";

export default function RoundProgressBar({
  value,
  text,
}: {
  value: number;
  text: string;
}) {
  return <CircularProgressbar value={value} text={text} />;
}
