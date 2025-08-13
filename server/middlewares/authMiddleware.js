const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized: Login Needed" })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: `Invalid token ${error.message}` });
    }
};

module.exports = verifyToken;