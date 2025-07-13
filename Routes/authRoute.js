const express = require("express")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../Modules/userSchema")
const router = express.Router();
const authentication = require("../Middleware/authentication")

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"

router.post("/auth/register", async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name){
            return res.status(400).json({message: `Name field is required*`, success: false})
        }
        if(!email){
            return res.status(400).json({message: `Email field is required*`, success: false})
        }
        if(!password){
            return res.status(400).json({message: `Password field is required*`, success: false})
        }

        const existsUser = await userModel.findOne({email})
        if(existsUser){
            return res.status(409).json({ message: "User already registered" });
        }


        const saltRounds = 10;
        const hashed = await bcrypt.hash(password, saltRounds)

        const newUser = new userModel({...req.body, password: hashed})
        await newUser.save()

        res.status(201).json({
            message: "User Registered Successfully",
            data: newUser,
            success: true
        })
        
    } catch (error) {
        res.status(500).json({
            message:`Internal server error in registered: ${error.message}`,
            success: false
        })
    }
})


router.post("/auth/login", async (req, res) => {
    try {
        const {email, password} = req.body

        const existsUser = await userModel.findOne({email})

        if(!existsUser){
            return res.status(404).json({
                success: false,
                message: `Email is incorrect or user not registered`
            })
        }
        

        const compare = await bcrypt.compare(password, existsUser.password)
        if(!compare){
            return res.status(401).json({message:`Password incorrect`})
        }


        const accessToken = jwt.sign(
            { id: existsUser._id, email: existsUser.email, name: existsUser.name, role: existsUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );


        res.status(200).json({
            success: true,
            message:"User LoggedIn Successfully",
            access_token: accessToken
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message:`Error in LoginIn: ${error.message}`
        })
    }
})


router.get("/api/auth/logout", async (req, res) => {
    try {
        
    } catch (error) {
        
    }
})


router.get("/api/auth/me", authentication, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
    
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        res.status(500).json({
            message: `Failed to fetch user: ${error.message}`,
            success: false,
        });
    }
})

module.exports = router;