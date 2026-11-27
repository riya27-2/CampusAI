
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import { connectDB } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import Syllabus from "../models/syllabus.js";
import { syllabusData } from "../../src/data/SyllabusData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");

async function uploadToCloudinary(buffer) {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          public_id: `campusai/syllabus/${crypto.randomUUID()}`,
          overwrite: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return {
      pdfUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
    };
  } catch (error) {
    console.log("\n--- CLOUDINARY ERROR ---");
    console.log("Message:", error.message);
    console.log("HTTP Code:", error.http_code);
    console.log("------------------------");
    throw error;
  }
}

async function migrate() {
  let uploadedCount = 0;
  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  const uploadedFiles = new Map();

  console.log("Starting syllabus migration...");

  for (const [dept, department] of Object.entries(syllabusData)) {
    console.log(`\nProcessing department: ${dept}`);

    for (const [semesterKey, subjects] of Object.entries(
      department.semesters
    )) {
      const semester = Number(semesterKey);

      console.log(`\nSemester ${semester}`);

      for (const subject of subjects) {
        const subjectName = subject.name;
        const pdfPath = subject.pdf;
        let filePath = "";

        try {
          if (
            !pdfPath ||
            !pdfPath.toLowerCase().endsWith(".pdf")
          ) {
            console.log(`SKIPPED: ${subjectName} (No PDF)`);
            skippedCount++;
            continue;
          }

          const relativePath = pdfPath.replace(/^[/\\]+/, "");

          filePath = path.resolve(PUBLIC_DIR, relativePath);

          // Prevent access outside public directory
          const relativeCheck = path.relative(PUBLIC_DIR, filePath);

          if (
            relativeCheck.startsWith("..") ||
            path.isAbsolute(relativeCheck)
          ) {
            console.log(`SKIPPED: Invalid path ${pdfPath}`);
            skippedCount++;
            continue;
          }

          // Check whether record already exists
          const existingRecord = await Syllabus.findOne({
            dept,
            semester,
            subjectName,
          });

          if (existingRecord) {
            console.log(`SKIPPED: ${subjectName} (Already exists)`);

            uploadedFiles.set(relativePath, {
              pdfUrl: existingRecord.pdfUrl,
              cloudinaryPublicId: existingRecord.cloudinaryPublicId,
            });

            skippedCount++;
            continue;
          }

          let cloudFile = uploadedFiles.get(relativePath);

          // Upload unique PDF only once
          if (!cloudFile) {
            console.log(`Uploading: ${relativePath}`);

            const buffer = await fs.readFile(filePath);

            cloudFile = await uploadToCloudinary(buffer);

            uploadedFiles.set(relativePath, cloudFile);
            uploadedCount++;

            console.log("Upload successful!");
            console.log("PDF URL:", cloudFile.pdfUrl);
          } else {
            console.log(`Reusing PDF: ${relativePath}`);
          }

          // Save PDF details in MongoDB
          await Syllabus.create({
            dept,
            semester,
            subjectName,
            pdfUrl: cloudFile.pdfUrl,
            cloudinaryPublicId: cloudFile.cloudinaryPublicId,
            fileName: path.basename(relativePath),
            contentType: "application/pdf",
          });

          createdCount++;

          console.log(`SAVED: ${dept} - ${subjectName}`);
        } catch (error) {
          errorCount++;

          console.log(`ERROR: ${dept} - ${subjectName}`);
          console.log("Message:", error.message);
          console.log("HTTP Code:", error.http_code);

          if (error.code === "ENOENT") {
            console.log("PDF NOT FOUND:", filePath);
          }
        }
      }
    }
  }

  console.log("\n========== MIGRATION SUMMARY ==========");
  console.log("Uploaded:", uploadedCount);
  console.log("MongoDB records created:", createdCount);
  console.log("Skipped:", skippedCount);
  console.log("Errors:", errorCount);
  console.log("========================================");
}

async function main() {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("MongoDB connected:", mongoose.connection.name);

    await migrate();
  } catch (error) {
    console.log("MIGRATION FAILED:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

main();
