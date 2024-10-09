"use server";

import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import HttpException from "@/server/utils/http-exceptions";
import {
  DealStatus,
  TransactionStatus,
  TransactionType,
  UserRole,
} from "@/types";
import { FormState } from "@/types/form.types";
import { Order, OrderStatus } from "@/types/order.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLoggedInUser } from "../auth/auth.actions";
import { DealDocument } from "../deal/deal.types";
import { MetricDocument } from "../metric/metric.types";
import { TransactionDocument } from "../transaction/transaction.types";
import { UserDocument } from "../user/user.types";
import { OrderDocument } from "./order.types";

export async function getOrder(orderId: string) {
  try {
    const db = await connectDB();
    const orderModel = db.models.Order as Model<OrderDocument>;
    const order = await orderModel.findById(orderId);
    if (!order) return undefined;

    return JSON.parse(JSON.stringify(order)) as Order;
  } catch (error: any) {
    return undefined;
  }
}

export async function createOrder(
  formState: FormState<Order | undefined>,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== UserRole.Industry) {
      throw new HttpException("Unauthorized", 403);
    }

    let { dealId, location } = z
      .object({
        dealId: z.string(),
        location: z.string(),
      })
      .parse({
        dealId: formData.get("dealId"),
        location: formData.get("location"),
      });

    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;
    const orderModel = db.models.Order as Model<OrderDocument>;
    const userModel = db.models.User as Model<UserDocument>;
    const dealModel = db.models.Deal as Model<DealDocument>;
    const metricModel = db.models.Metric as Model<MetricDocument>;

    const deal = await dealModel.findById(dealId);

    if (!deal) {
      throw new HttpException("Deal not found", 404);
    }

    if (deal.status !== DealStatus.Pending) {
      throw new HttpException("Deal already closed");
    }

    const orderAmount = deal.pricePerItem * deal.quantity;

    if (user.walletBalance < orderAmount) {
      throw new HttpException("Insufficient wallet balance");
    }

    // create pending order
    const order = await orderModel.create({
      dealId,
      buyerId: user._id,
      sellerId: deal.dealer,
      amount: orderAmount,
      location,
      status: OrderStatus.Pending,
    });

    // create purchase transaction for buyer
    await transactionModel.create({
      orderId: order._id,
      userId: user._id,
      amount: -orderAmount,
      status: TransactionStatus.Success,
      type: TransactionType.Purchase,
    });

    // debit buyer wallet
    await userModel.findByIdAndUpdate(user._id, {
      $inc: { walletBalance: -orderAmount },
    });

    // update buyer metric
    await metricModel.findByIdAndUpdate(user._id, {
      $inc: {
        totalAmountSpent: orderAmount,
        totalQuantityPurchased: deal.quantity,
      },
    });

    // update deal
    deal.status = DealStatus.Sold;
    await deal.save();

    revalidatePath("/", "layout");

    return {
      status: "SUCCESS",
      message: "Purchase successful",
      data: JSON.parse(JSON.stringify(order)) as Order,
      timestamp: new Date().getTime(),
    } satisfies FormState<Order>;
  } catch (error: any) {
    console.log(error);
    return fromErrorToFormState(error);
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== UserRole.Farmer) {
      throw new HttpException("Unauthorized", 401);
    }

    const db = await connectDB();
    const orderModel = db.models.Order as Model<OrderDocument>;

    const order = await orderModel.findOne({
      _id: orderId,
      sellerId: user._id,
      status: {
        $nin: [OrderStatus.Completed, OrderStatus.Cancelled],
      },
    });

    if (!order) {
      throw new HttpException("Order not found", 400);
    }

    if (order.status === OrderStatus.Delivered) {
      throw new HttpException("Order already delivered", 400);
    }

    // update order status
    order.status = OrderStatus.Delivered;
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
    if (!user || user.role !== UserRole.Industry) {
      throw new HttpException("Unauthorized", 401);
    }

    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;
    const orderModel = db.models.Order as Model<OrderDocument>;
    const userModel = db.models.User as Model<UserDocument>;
    const dealModel = db.models.Deal as Model<DealDocument>;
    const metricModel = db.models.Metric as Model<MetricDocument>;

    const order = await orderModel.findOne({
      _id: orderId,
      buyerId: user._id,
      status: { $nin: [OrderStatus.Completed, OrderStatus.Cancelled] },
    });

    if (!order) {
      throw new HttpException("Order not found", 404);
    }

    if (order.status === OrderStatus.Delivered) {
      throw new HttpException("Order already delivered");
    }

    const deal = await dealModel.findById(order.dealId);

    if (!deal) {
      throw new HttpException("Deal not found", 404);
    }

    // create purchase refund transaction
    await transactionModel.create({
      userId: user._id,
      amount: order.amount,
      status: TransactionStatus.Success,
      type: TransactionType.Refund,
    });

    // refund industry wallet balance
    await userModel.findByIdAndUpdate(user._id, {
      $inc: { walletBalance: order.amount },
    });

    // update buyer metric
    await metricModel.findByIdAndUpdate(
      { userId: user._id },
      {
        $inc: {
          totalAmountSpent: -order.amount,
          totalQuantityPurchased: -deal.quantity,
        },
      }
    );

    // update deal status back to pending
    deal.status = DealStatus.Pending;
    await deal.save();

    order.status = OrderStatus.Cancelled;
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
    if (!user || user.role !== UserRole.Industry) {
      throw new HttpException("Unauthorized", 403);
    }

    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;
    const orderModel = db.models.Order as Model<OrderDocument>;
    const userModel = db.models.User as Model<UserDocument>;
    const dealModel = db.models.Deal as Model<DealDocument>;
    const metricModel = db.models.Metric as Model<MetricDocument>;

    const order = await orderModel.findOne({
      _id: orderId,
      buyerId: user._id,
      status: { $nin: [OrderStatus.Completed, OrderStatus.Cancelled] },
    });

    if (!order) {
      throw new HttpException("Order not found", 404);
    }

    if (order.status !== OrderStatus.Delivered) {
      throw new HttpException("Order has not been delivered yet", 400);
    }

    const deal = await dealModel.findById(order.dealId);

    if (!deal) {
      throw new HttpException("Deal not found", 404);
    }

    // create sale transaction
    await transactionModel.create({
      orderId: order._id,
      userId: order.sellerId,
      amount: order.amount,
      status: TransactionStatus.Success,
      type: TransactionType.Sale,
    });

    // update seller wallet balance
    await userModel.findByIdAndUpdate(order.sellerId, {
      $inc: { walletBalance: order.amount },
    });

    // update seller metrics
    await metricModel.findOneAndUpdate(
      { userId: order.sellerId },
      {
        $inc: {
          totalAmountSold: order.amount,
          totalQuantitySold: deal.quantity,
        },
      }
    );

    order.status = OrderStatus.Completed;
    await order.save();

    revalidatePath("/", "layout");

    return JSON.parse(JSON.stringify(order)) as Order;
  } catch (error: any) {
    throw new HttpException(error.message, error.code || 500);
  }
}
