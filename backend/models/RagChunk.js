import mongoose from "mongoose";

const ragChunkSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    // "college" = general info, "syllabus" = professor-uploaded syllabus
    source: { type: String, enum: ["college", "syllabus"], default: "college" },
    course: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("RagChunk", ragChunkSchema);
