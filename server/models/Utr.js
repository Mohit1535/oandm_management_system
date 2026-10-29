import mongoose from "mongoose";

const utrSchema = new mongoose.Schema(
  {
employeeId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Employee",
  required:true
},


    month: {
      type: String,
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