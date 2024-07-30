"use server";

import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ROLES } from "@/types";
import { FormState } from "@/types/form.types";
import { Payment } from "@/types/payment.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "../auth/auth.actions";
import { TransactionDocument } from "../transaction/transaction.types";
import { PaymentDocument } from "./payment.types";
import { CreatePaymentSchema } from "./payment.validation";

export async function getUserPayments(userId: string) {
  try {
    const db = await connectDB();
    const paymentModel = db.models.Payment as Model<PaymentDocument>;

    return JSON.parse(
      JSON.stringify(await paymentModel.find({ userId }))
    ) as Payment[];
  } catch (error: any) {
    return [];
  }
}

export async function getPayment(paymentId: string) {
  try {
    const db = await connectDB();
    const paymentModel = db.models.Payment as Model<PaymentDocument>;

    return JSON.parse(
      JSON.stringify(await paymentModel.findOne({ _id: paymentId }))
    ) as Payment;
  } catch (error: any) {
    return undefined;
  }
}

export async function makePayment(formState: FormState, formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== USER_ROLES.INDUSTRY) {
      throw new Error("Unauthorised");
    }

    let validData = CreatePaymentSchema.parse({
      buyerId: formData.get("buyerId"),
      sellerId: formData.get("sellerId"),
      quantity: formData.get("quantity"),
      amount: formData.get("amount"),
    });

    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;
    const paymentModel = db.models.Payment as Model<PaymentDocument>;

    const transaction = await transactionModel.create({
      userId: user._id,
      amount: validData.amount,
      quantity: validData.quantity,
      status: TRANSACTION_STATUS.SUCCESS,
      type: TRANSACTION_TYPE.PURCHASE,
    });

    const payment = await paymentModel.create({
      ...validData,
      userId: user._id,
      transactionId: transaction._id,
    });

    revalidatePath(PAGES.DASHBOARD);

    return {
      status: "SUCCESS",
      message: "payment created",
      data: JSON.parse(JSON.stringify(payment)) as Payment,
      timestamp: new Date().getTime(),
    } satisfies FormState<Payment>;
  } catch (error: any) {
    console.log(error);
    return fromErrorToFormState(error);
  }
}
