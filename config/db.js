require("dotenv").config();
const mongoose = require("mongoose")
const URL = process.env.MONGO_URI

const connectDB = async () => {
    try {
        mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB connected")
    } catch (error) {
        console.log("MongoDB not connected", error,message)
    }
}

module.exports = connectDB;