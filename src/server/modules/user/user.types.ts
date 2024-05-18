import { User } from "@/types/user.types";
import { Document } from "mongoose";

export interface UserDocument extends Omit<User, "_id">, Document {}
