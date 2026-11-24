import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: String,
    icon: { type: String, default: "📢" },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
