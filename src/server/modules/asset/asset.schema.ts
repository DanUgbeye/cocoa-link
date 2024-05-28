import mongoose from "mongoose";

export const assetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "users" },
    name: { type: String, required: true },
    description: { type: String },
    currentLocation: { type: String, required: true },
    acquisitionDate: { type: Date, required: true },
    depreciationRate: { type: Number, required: true },
    purchaseCost: { type: Number, default: 0 },
    totalExpenditure: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Damaged", "Sold"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Virtual field for currentValue
assetSchema.virtual("currentValue").get(function () {
  const currentDate = new Date().getTime();
  const yearsElapsed =
    (currentDate - new Date(this.acquisitionDate).getTime()) /
    (1000 * 60 * 60 * 24 * 365); // Convert milliseconds to years
  const depreciationAmount =
    this.purchaseCost * (this.depreciationRate / 100) * yearsElapsed;
  const currentValue = Math.max(this.purchaseCost - depreciationAmount, 0); // Ensure the value doesn't go below zero
  return currentValue;
});

// Virtual field for currentValuePercentage
assetSchema.virtual("currentValuePercentage").get(function () {
  // @ts-ignore
  const currentValue = this.currentValue;
  const currentValuePercentage = (
    currentValue ? ((currentValue as number) / this.purchaseCost) * 100 : 0
  ) as number;
  return currentValuePercentage;
});

// Ensure virtual fields are included in the output
assetSchema.set("toJSON", { virtuals: true });
assetSchema.set("toObject", { virtuals: true });
