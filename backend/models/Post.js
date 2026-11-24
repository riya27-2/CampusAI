import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["assignment", "event", "placement"], required: true },
    title: { type: String, default: "", trim: true },   // sirf assignment mein zaroori
    description: { type: String, default: "", trim: true },
    date: { type: Date },
    link: { type: String, default: "", trim: true },
    course: { type: String, default: "", trim: true },
    file: {
      filename: String,
      originalName: String,
      mimetype: String,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);