const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
// console.log("JWT_SECRET:", JWT_SECRET); // Debugging line to check if JWT_SECRET is set

function authenticateToken(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret is not configured" });
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; // ส่ง user ไปให้ route ต่อไปใช้ได้
    next();
  });
}

module.exports = authenticateToken;
