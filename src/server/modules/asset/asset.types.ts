import { Asset } from "@/types/asset.types";
import { Document } from "mongoose";

export interface AssetDocument
  extends Document<Omit<Asset, "_id">> {}
