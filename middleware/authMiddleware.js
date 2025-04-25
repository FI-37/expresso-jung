// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Ungültiger Token:", err.message);
    res.clearCookie("token");
    res.redirect("/login");
  }
}
