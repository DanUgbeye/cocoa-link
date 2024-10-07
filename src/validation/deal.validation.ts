import { CocoaVariant } from "@/types";
import { z, ZodType } from "zod";

export const CocoaVariantSchema = z.enum([
  CocoaVariant.Amelonado,
  CocoaVariant.Criollo,
  CocoaVariant.Hybrid,
  CocoaVariant.Trinitario,
]) satisfies ZodType<CocoaVariant>;
