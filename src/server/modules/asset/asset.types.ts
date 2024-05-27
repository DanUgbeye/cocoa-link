import { Asset } from "@/types/asset.types";
import { Document } from "mongoose";

export interface AssetDocument
  extends Document<string, {}, Omit<Asset, "_id">> {}
