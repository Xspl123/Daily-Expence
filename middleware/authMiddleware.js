const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Expecting header format: "Bearer <token>"
  const tokenParts = authHeader.split(" ");
  const token = tokenParts.length === 2 ? tokenParts[1] : authHeader;

  try {
    // Verify token using SESSION_SECRET from .env
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    console.log("Decoded Token:", decoded); // Debugging line

    if (!decoded.id && !decoded.userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    req.user = {
      id: decoded.id || decoded.userId, // Ensure correct ID is used
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};
