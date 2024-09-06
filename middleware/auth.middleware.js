const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Authorization header not found or invalid" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.userId = decoded.userId; // Ensure 'userId' matches the payload key
        next();
    } catch (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: "Not authorized" });
    }
};

module.exports = {
    authMiddleware
};
