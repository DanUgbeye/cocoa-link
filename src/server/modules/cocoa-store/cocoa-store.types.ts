import { CocoaStore } from "@/types/cocoa-store.types";
import { Document } from "mongoose";

export interface CocoaStoreDocument
  extends Omit<CocoaStore, "_id">,
    Document {}
