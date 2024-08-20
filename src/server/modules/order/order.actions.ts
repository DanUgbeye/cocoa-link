"use server";

import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import HttpException from "@/server/utils/http-exceptions";
import { TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ROLES } from "@/types";
import { FormState } from "@/types/form.types";
import { Order, ORDER_STATUS } from "@/types/order.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "../auth/auth.actions";
import { CocoaStoreDocument } from "../cocoa-store/cocoa-store.types";
import { TransactionDocument } from "../transaction/transaction.types";
import { UserDocument } from "../user/user.types";
import { OrderDocument } from "./order.types";
import { CreateOrderSchema } from "./order.validation";

export async function getOrder(orderId: string) {
  try {
    const db = await connectDB();
    const orderModel = db.models.Order as Model<OrderDocument>;
    const order = await orderModel.findOne({ _id: orderId });
    if (!order) return undefined;

    return JSON.parse(JSON.stringify(order)) as Order;
  } catch (error: any) {
    return undefined;
  }
}

export async function createOrder(formState: FormState, formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== USER_ROLES.INDUSTRY) {
      throw new Error("Unauthorised");
    }

    let validData = CreateOrderSchema.parse({
      buyerId: formData.get("buyerId"),
      sellerId: formData.get("sellerId"),
      quantity: formData.get("quantity"),
      amount: formData.get("amount"),
      location: formData.get("location"),
    });

    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;
    const orderModel = db.models.Order as Model<OrderDocument>;
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
      status: TRANSACTION_STATUS.SUCCESS,
      type: TRANSACTION_TYPE.PURCHASE,
    });

    // update cocoa store stats
    cocoaStore.quantity -= validData.quantity;
    await cocoaStore.save();

    // debit buyer wallet
    await userModel.findByIdAndUpdate(user._id, {
      walletBalance: user.walletBalance - validData.amount,
    });

    const order = await orderModel.create({
      ...validData,
      transactionId: purchaseTransaction._id,
    });

    revalidatePath("/", "layout");

    return {
      status: "SUCCESS",
      message: "purchase successful",
      data: JSON.parse(JSON.stringify(order)),
      timestamp: new Date().getTime(),
    } satisfies FormState<Order>;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== USER_ROLES.FARMER) {
      throw new HttpException("Unauthorised", 401);
    }

    const db = await connectDB();
    const orderModel = db.models.Order as Model<OrderDocument>;

    const order = await orderModel.findOne({ _id: orderId });
    if (!order || String(order.sellerId) !== user._id) {
      throw new HttpException("Order not found", 400);
    }

    // update order status
    order.status = ORDER_STATUS.DELIVERED;
    order.deliveredAt = new Date();
    await order.save();

    revalidatePath("/", "layout");

    return JSON.parse(JSON.stringify(order)) as Order;
  } catch (error: any) {
    throw new HttpException(error.message, error.code || 500);
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== USER_ROLES.INDUSTRY) {
      throw new HttpException("Unauthorised", 401);
    }

    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;
    const orderModel = db.models.Order as Model<OrderDocument>;
    const userModel = db.models.User as Model<UserDocument>;
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;

    const order = await orderModel.findOne({ _id: orderId });

    if (
      !order ||
      String(order.buyerId) !== user._id ||
      order.status === ORDER_STATUS.COMPLETED ||
      order.status === ORDER_STATUS.CANCELLED
    ) {
      throw new HttpException("Order not found", 400);
    }

    if (order.status === ORDER_STATUS.DELIVERED) {
      throw new HttpException("Order already delivered", 400);
    }

    const cocoaStore = await cocoaStoreModel.findOne({
      userId: order.sellerId,
    });

    if (!cocoaStore) {
      throw new Error("Deal not found");
    }

    const prevTransaction = await transactionModel.findById(
      order.transactionId
    );

    if (!prevTransaction) {
      throw new HttpException("Transaction not found");
    }

    // refund cocoa store quantity
    cocoaStore.quantity += order.quantity;
    await cocoaStore.save();

    // create purchase refund transaction
    await transactionModel.create({
      userId: user._id,
      amount: order.amount,
      status: TRANSACTION_STATUS.SUCCESS,
      type: TRANSACTION_TYPE.REFUND,
    });

    // refund industry wallet balance
    await userModel.findByIdAndUpdate(user._id, {
      $inc: { walletBalance: order.amount },
    });

    order.status = ORDER_STATUS.CANCELLED;
    await order.save();

    revalidatePath("/", "layout");

    return JSON.parse(JSON.stringify(order)) as Order;
  } catch (error: any) {
    throw new HttpException(error.message, error.code || 500);
  }
}

export async function completeOrder(orderId: string) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== USER_ROLES.INDUSTRY) {
      throw new HttpException("Unauthorised", 401);
    }

    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;
    const orderModel = db.models.Order as Model<OrderDocument>;
    const userModel = db.models.User as Model<UserDocument>;
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;

    const order = await orderModel.findOne({ _id: orderId });
    if (
      !order ||
      String(order.buyerId) !== user._id ||
      order.status === ORDER_STATUS.COMPLETED ||
      order.status === ORDER_STATUS.CANCELLED
    ) {
      throw new HttpException("Order not found", 400);
    }

    if (order.status !== ORDER_STATUS.DELIVERED) {
      throw new HttpException("Order not delivered", 400);
    }

    const cocoaStore = await cocoaStoreModel.findOne({
      userId: order.sellerId,
    });

    if (!cocoaStore) {
      throw new Error("Deal not found");
    }

    const prevTransaction = await transactionModel.findById(
      order.transactionId
    );
    if (!prevTransaction) {
      throw new HttpException("Transaction not found");
    }

    // update seller cocoa metrics
    cocoaStore.totalAmountSold += order.amount;
    cocoaStore.totalQuantitySold += order.quantity;
    await cocoaStore.save();

    // create sale transaction
    await transactionModel.create({
      userId: order.sellerId,
      amount: order.amount,
      status: TRANSACTION_STATUS.SUCCESS,
      type: TRANSACTION_TYPE.SALE,
    });

    // update seller walet balance
    await userModel.findByIdAndUpdate(order.sellerId, {
      $inc: { walletBalance: order.amount },
    });

    order.status = ORDER_STATUS.COMPLETED;
    await order.save();

    revalidatePath("/", "layout");

    return JSON.parse(JSON.stringify(order)) as Order;
  } catch (error: any) {
    throw new HttpException(error.message, error.code || 500);
  }
}
