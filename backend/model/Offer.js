import mongoose from "mongoose";
import Product from "./Product.js";

const offerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    offerType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    offerValue: {
      type: Number,
      required: true,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    applicableToProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    applicableToCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);


offerSchema.pre("save", function (next) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to the start of the day
  if (this.endDate < this.startDate) {
    return next(new Error("End date cannot be before start date"));
  }
  if (this.startDate < currentDate) {
    return next(new Error("Start date cannot be in the past"));
  }
  if (
    this.offerType === "percentage" &&
    (this.offerValue <= 0 || this.offerValue > 80)
  ) {
    return next(
      new Error("Offer value for percentage must be between 1 and 80")
    );
  }
  if (this.offerType === "fixed" && this.offerValue <= 0) {
    return next(
      new Error("Offer value for fixed amount must be greater than 0")
    );
  }
  next();
});

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
