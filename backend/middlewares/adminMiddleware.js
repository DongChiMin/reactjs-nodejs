const jwt = require("jsonwebtoken");

const adminOnly = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
};
  

module.exports = adminOnly;