
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token)
      return res.status(401).json({
        error: "Please log in first."
      });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");

    if (!user)
      return res.status(401).json({
        error: "User not found."
      });

    req.user = user;
    next();

  } catch {
    res.status(401).json({
      error: "Invalid or expired token. Please log in again."
    });
  }
}

export function requireRole(...roles) {
  return (req, res, next) =>
    roles.includes(req.user?.role)
      ? next()
      : res.status(403).json({
          error: "You are not authorized to access this feature."
        });
}
