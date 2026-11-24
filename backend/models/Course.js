import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  level: { type: String, enum: ["degree", "diploma"], required: true, index: true },
  name: { type: String, required: true },
  description: String,
  seats: Number,
  duration: String,
  icon: String,
});

export default mongoose.model("Course", courseSchema);
