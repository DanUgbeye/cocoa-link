"use client";

import { useAppStore } from "@/client/store";
import { Button } from "@/components/ui/button";
import React from "react";

export function CreateDealButton() {
  const toggleCreateDealModal = useAppStore(
    (state) => state.toggleCreateDealModal
  );

  return (
    <Button
      className="bg-blue-500 hover:bg-blue-600"
      onClick={() => toggleCreateDealModal(true)}
    >
      Create Deal
    </Button>
  );
}
