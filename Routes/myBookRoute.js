const express = require("express")
const router = express.Router()
const userBookModel = require("../Modules/userBookSchema")
const authentication = require("../Middleware/authentication")


router.post("/api/mybooks/:bookId", authentication, async (req, res) => {
    try {
        const {bookId} = req.params;
        const userId = req.user.id

        if(!bookId){
            return res.status(400).json({ message: "Book ID is required" });
        }

        const exists = await userBookModel.findOne({ userId, bookId });

        if (exists) {
            return res.status(409).json({ message: "Book already in your list" });
        }

        const newEntry = new userBookModel({ userId, bookId });
        await newEntry.save();

        res.status(201).json({
            success: true,
            message: "Book added to your list",
            data: newEntry,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error adding book: ${error.message}`,
        });
    }
})


router.get("/api/mybooks", authentication, async (req, res) => {
  try {
    const userId = req.user.id;

    const userBooks = await userBookModel.find({ userId }).populate("bookId");

    res.status(200).json({
      success: true,
      message: "Fetched your book list successfully",
      data: userBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get books: ${error.message}`,
    });
  }
});

module.exports = router;