import mongoose from "mongoose";

const infoSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // "fees", "student-support"
  title: String,
  data: mongoose.Schema.Types.Mixed,
});

export default mongoose.model("Info", infoSchema);
