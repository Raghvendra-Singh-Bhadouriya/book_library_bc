const mongoose = require("mongoose")

const userBookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        required: true
    },
    status: {
        type: String,
        enum: ["Want to Read", "Currently Reading", "Read"],
        default: "Want to Read"
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
},{
    versionKey: false
})

const userBookModel = mongoose.model("userBook", userBookSchema)

module.exports = userBookModel;