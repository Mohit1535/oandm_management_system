import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
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

    sites: {
      type: [String],
      required: true,
    },

    branchName: {
      type: [String],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    attachment: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);
const Complaint =
  mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);

export default Complaint;
