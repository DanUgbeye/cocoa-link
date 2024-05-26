import { Asset } from "@/types/asset.types";
import { Document } from "mongoose";

export interface AssetDocument extends Omit<Asset, "_id">, Document {}
