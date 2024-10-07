"use server";

import connectDB from "@/server/db/connect";
import { Metric } from "@/types";
import { Model } from "mongoose";
import { MetricDocument } from "./metric.types";

export async function getMetrics(userId: string) {
  try {
    const db = await connectDB();
    const metricModel = db.models.Metric as Model<MetricDocument>;
    const metrics = await metricModel.find({ from: userId });

    return JSON.parse(JSON.stringify(metrics)) as Metric;
  } catch (error: any) {
    // console.log(error);
    return undefined;
  }
}

export async function getUserMetrics(userId: string) {
  try {
    const db = await connectDB();
    const metricModel = db.models.Metric as Model<MetricDocument>;
    const metrics = await metricModel.find({ from: userId });

    return JSON.parse(JSON.stringify(metrics)) as Metric;
  } catch (error: any) {
    // console.log(error);
    return undefined;
  }
}
