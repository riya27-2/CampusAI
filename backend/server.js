
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import postRoutes, { UPLOAD_DIR } from "./routes/posts.js";
import syllabusRoutes from "./routes/syllabus.js";
import dashboardRoutes from "./routes/dashboard.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = [
  "https://campus-ai-kohl.vercel.app",
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
].filter(Boolean);

console.log("CORS allowed origins:", allowedOrigins);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "100kb" }));

// Existing uploaded PDF/images
app.use("/uploads", express.static(UPLOAD_DIR, {
  setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
}));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", routes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`CampusAI API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Startup failed:", err.message);
    process.exit(1);
  });
