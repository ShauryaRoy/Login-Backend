const mongoose = require("mongoose")
const connectDB = async () => {

    try {
        const connection = await mongoose.connect("mongodb+srv://shaurya:shauryaroy@logindetails.chlzx.mongodb.net/")
        console.log("Connection has nbeen secured")
    } catch (error) {
        console.log("Error is ", error)
    }
}

module.exports = connectDB