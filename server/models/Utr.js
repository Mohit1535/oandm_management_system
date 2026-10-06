import mongoose from "mongoose";

const utrSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    month: {
      type: Date,
      required: true,
    },

    utrNo: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    sites: {
      type: [String],
      default: [],
    },

    branches: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Utr =
  mongoose.models.Utr ||
  mongoose.model("Utr", utrSchema);

export default Utr;