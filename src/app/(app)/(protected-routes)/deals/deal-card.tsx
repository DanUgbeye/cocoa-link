import { Deal } from "@/types";
import React from "react";

interface MyDealCardProps {
  deal: Deal;
}

export function MyDealCard(props: MyDealCardProps) {
  return <div>DealCard</div>;
}

interface DealCardProps {
  deal: Deal;
}

export function DealCard(props: DealCardProps) {
  return <div>DealCard</div>;
}
