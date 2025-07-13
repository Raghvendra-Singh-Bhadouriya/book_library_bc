const express = require("express")
const router = express.Router()
const bookModel = require("../Modules/bookSchema")

router.post("/book", async (req, res) => {
    try {
        const newBook = await bookModel(req.body)
        newBook.save();

        res.status(201).json({
            message: `New Book added successfully`,
            data: newBook
        })
    } catch (error) {
        res.status(500).json({
            message:`Error in post Book ${error.message}`
        })
    }
})

router.get("/books", async (req, res) => {
    try {
        const allBooks = await bookModel.find()

        res.status(200).json({
            message: `Books fetched successfully`,
            data: allBooks
        })
    } catch (error) {
        res.status(500).json({
            message: `Error in get Books ${error.message}`,
        })
    }
})
module.exports = router;