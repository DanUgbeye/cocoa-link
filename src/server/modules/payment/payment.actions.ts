"use server";

import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ROLES } from "@/types";
import { FormState } from "@/types/form.types";
import { Payment } from "@/types/payment.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "../auth/auth.actions";
import { TransactionDocument } from "../transaction/transaction.types";
import { UserDocument } from "../user/user.types";
import { PaymentDocument } from "./payment.types";
import { CreatePaymentSchema } from "./payment.validation";
import { CocoaStoreDocument } from "../cocoa-store/cocoa-store.types";

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
    const userModel = db.models.User as Model<UserDocument>;
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;

    const seller = await userModel.findById(validData.sellerId);

    if (!seller) {
      throw new Error("Seller not found");
    }

    const cocoaStore = await cocoaStoreModel.findOne({ userId: seller._id });

    if (!cocoaStore) {
      throw new Error("Deal not found");
    }

    // create purchase transaction
    const purchaseTransaction = await transactionModel.create({
      userId: validData.buyerId,
      amount: -validData.amount,
      quantity: validData.quantity,
      status: TRANSACTION_STATUS.SUCCESS,
      type: TRANSACTION_TYPE.PURCHASE,
    });

    // create sale transaction
    const saleTransaction = await transactionModel.create({
      userId: validData.sellerId,
      amount: validData.amount,
      quantity: validData.quantity,
      status: TRANSACTION_STATUS.SUCCESS,
      type: TRANSACTION_TYPE.SALE,
    });

    // credit seller wallet
    seller.walletBalance += validData.amount;
    await seller.save();

    // update cocoa store stats
    cocoaStore.quantity -= validData.quantity;
    cocoaStore.totalAmountSold += validData.amount;
    cocoaStore.totalQuantitySold += validData.quantity;
    await cocoaStore.save();

    // debit buyer wallet
    await userModel.findByIdAndUpdate(user._id, {
      walletBalance: user.walletBalance - validData.amount,
    });

    const payment = await paymentModel.create({
      ...validData,
      transactionId: purchaseTransaction._id,
    });

    revalidatePath("/", "layout");

    return {
      status: "SUCCESS",
      message: "purchase successful",
      data: JSON.parse(JSON.stringify(payment)),
      timestamp: new Date().getTime(),
    } satisfies FormState<Payment>;
  } catch (error: any) {
    console.log(error);
    return fromErrorToFormState(error);
  }
}
