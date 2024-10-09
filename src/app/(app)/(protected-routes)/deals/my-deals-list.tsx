"use client";

import { useAppStore } from "@/client/store";
import { MyDealCard } from "@/components/deal/my-deal-card";
import { deleteDeal } from "@/server/modules/deal/deal.actions";
import { FullDeal } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  deals: FullDeal[];
}

export default function MyDealsList(props: Props) {
  const { deals } = props;
  const router = useRouter();
  const { toggleEditDealModal } = useAppStore();

  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  function toggleDeleteId(id: string) {
    if (deletingIds.includes(id)) {
      setDeletingIds((prev) => prev.filter((prevId) => prevId !== id));
    } else {
      setDeletingIds((prev) => Array.from(new Set([...prev, id])));
    }
  }

  async function handleEdit(deal: FullDeal) {
    toggleEditDealModal(deal);
  }

  async function handleDeleteDeal(deal: FullDeal) {
    if (deletingIds.includes(deal._id)) return;

    try {
      toggleDeleteId(deal._id);
      await deleteDeal(deal._id);
      toast.success("Deal deleted");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toggleDeleteId(deal._id);
    }
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-6">
      {deals.map((deal) => (
        <MyDealCard
          key={deal._id}
          deal={deal}
          loading={{ delete: deletingIds.includes(deal._id) }}
          onEdit={handleEdit}
          onDelete={handleDeleteDeal}
        />
      ))}
    </div>
  );
}
