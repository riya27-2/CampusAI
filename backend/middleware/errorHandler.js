export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
}

// Express 4 mein async handler ke errors ko errorHandler tak pahunchane ke liye
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
