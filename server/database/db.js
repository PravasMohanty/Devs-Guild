const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DBConnection = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URL;
        await mongoose.connect(MONGO_URI,);
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = DBConnection;
