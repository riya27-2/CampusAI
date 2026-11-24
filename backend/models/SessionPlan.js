import mongoose from "mongoose";

const sessionPlanSchema = new mongoose.Schema(
  {
    course: String,
    professor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    totalSessions: Number,
    minutesPerSession: Number,
    sessions: [
      {
        sessionNo: Number,
        topic: String,
        subtopics: [String],
        objectives: [String],
        activities: [String],
        assessment: String,
        references: [String],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("SessionPlan", sessionPlanSchema);