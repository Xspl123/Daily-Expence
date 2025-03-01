const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // ✅ Ensure "Bearer <token>" format
  const tokenParts = authHeader.split(" ");
  const token = tokenParts.length === 2 ? tokenParts[1] : authHeader;

  try {
    if (!process.env.SESSION_SECRET) {
      console.error("SESSION_SECRET is missing in .env file");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    console.log("✅ Decoded Token:", decoded); // Debugging line

    // ✅ Ensure decoded token has an ID
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    // ✅ Set user in request
    req.user = { id: userId };

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};
