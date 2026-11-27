
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pdfPath = path.resolve(
  __dirname,
  "../../public/CE/Maths-I.pdf"
);

async function testUpload() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `campusai/test/${Date.now()}`;

    const signatureString =
      `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    const form = new FormData();

    form.append("file", new Blob([
      fs.readFileSync(pdfPath)
    ], { type: "application/pdf" }), "Maths-I.pdf");

    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("public_id", publicId);
    form.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    const responseBody = await response.text();

    console.log("HTTP Status:", response.status);
    console.log("Cloudinary Error:", response.headers.get("x-cld-error"));
    console.log("Response:", responseBody);

  } catch (error) {
    console.log("Test Error:", error.message);
  }
}

testUpload();
