export default function requestLogger(req, res, next) {
  const now = new Date();

  const pad = (n) => String(n).padStart(2, "0");
  const ts =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  console.log(`[movie-server] [${ts}] ${req.method} ${req.originalUrl}`);
  return next();
}
