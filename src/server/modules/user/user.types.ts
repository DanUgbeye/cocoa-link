import { User } from "@/types";
import { Document } from "mongoose";

export type ServerUser = User & {
  password: string;
};

export interface UserDocument extends Omit<ServerUser, "_id">, Document {}
