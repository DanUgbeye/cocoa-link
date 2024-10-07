"use client";

import DepositModal from "@/components/modals/deposit-modal";
import WithdrawModal from "@/components/modals/withdraw-modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

// CSS FILES
import CreateDealModal from "@/components/modals/create-deal-modal";
import "react-circular-progressbar/dist/styles.css";
import "react-toastify/dist/ReactToastify.min.css";
import BuyModal from "@/components/modals/buy-modal";

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop={false}
        theme="colored"
        stacked
        hideProgressBar
      />
      <WithdrawModal />
      <DepositModal />
      <CreateDealModal />
      <BuyModal />

      {children}
    </QueryClientProvider>
  );
}
