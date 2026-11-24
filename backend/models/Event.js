import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true, index: true },
  time: String,
  venue: String,
});

export default mongoose.model("Event", eventSchema);
