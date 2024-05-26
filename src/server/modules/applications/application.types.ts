import { Application } from "@/types/application.types";
import { Document } from "mongoose";

export interface ApplicationDocument
  extends Omit<Application, "_id">,
    Document {}
