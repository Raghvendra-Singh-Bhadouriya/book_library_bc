require("dotenv").config();
const express = require("express")
const PORT = process.env.PORT || 3000
const cors = require("cors")
const server = express()
const connection = require("./config/db")

server.use(express.json())

const authRouter = require("./Routes/authRoute")
const bookRouter = require("./Routes/booksRoute")
const myBookRouter = require("./Routes/myBookRoute")

server.use(cors({
    origin: "http://localhost:5173"
}));
server.use("/", authRouter)
server.use("/", bookRouter)
server.use("/", myBookRouter)


server.listen(PORT, async () => {
    try {
        await connection()
        console.log("server is running on port", PORT)
    } catch (error) {
        console.log("error", error)
    }
})