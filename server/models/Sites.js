import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sites =
  mongoose.models.Sites || mongoose.model("Sites", siteSchema);

export default Sites;