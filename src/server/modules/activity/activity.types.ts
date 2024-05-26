import { Activity } from "@/types/activity.types";
import { Document } from "mongoose";

export interface ActivityDocument extends Omit<Activity, "_id">, Document {}
