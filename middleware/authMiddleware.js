const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Expecting header format: "Bearer <token>"
  const tokenParts = authHeader.split(' ');
  const token = tokenParts.length === 2 ? tokenParts[1] : authHeader;

  try {
    // Verify token using your SESSION_SECRET from .env
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded; // Now req.user should have { userId: ... }
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
