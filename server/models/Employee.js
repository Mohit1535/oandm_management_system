import mongoose from "mongoose"
const EmployeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    sites: {
      type: [String],
      required: true,
      default: [],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    branchName: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Employee", EmployeeSchema);