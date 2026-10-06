import mongoose from "mongoose";
import { branchName, Sites } from "../../client/src/assets.js";

const complaintSchema = new mongoose.Schema(
  {
    sites: {
      type: String,
      enum: Sites,
      required: true,
    },

    branchName: {
      type: String,
      enum: branchName,
      required: true,
    },

    assetsName: {
      type: String,
      required: true,
    },

    complaintDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, // Store image URL or file path
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint =
  mongoose.models.Complaint ||
  mongoose.model("Complaint", complaintSchema);

export default Complaint;