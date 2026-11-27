
import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema(
  {
    dept: {
      type: String,
      enum: ["CE", "IT"],
      required: true,
    },

    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    cloudinaryPublicId: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    contentType: {
      type: String,
      default: "application/pdf",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
