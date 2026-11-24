import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  branch: { type: String, required: true, enum: ["CE", "IT"], index: true },
  semester: { type: Number, required: true, min: 1, max: 8, index: true },
  name: { type: String, required: true, trim: true },
  pdf: { type: String, default: null }, // null = syllabus abhi upload nahi hua
});
subjectSchema.index({ branch: 1, semester: 1, name: 1 }, { unique: true });
subjectSchema.index({ name: "text" });

export default mongoose.model("Subject", subjectSchema);
