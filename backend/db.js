const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};

module.exports = connectToMongo;