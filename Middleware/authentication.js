// require("dotenv").config();
// const jwt = require("jsonwebtoken")

// const authentication = async (req, res, next) => {
//     try {
//         const authHeader = req.header.authorization

//         if(!authHeader || !authHeader.startWith("Bearer ")){
//             return res.status(400).json({
//                 message: `Authorization Header missing`
//             })
//         }

//         const token = authHeader.split(" ")[1]

//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if(err){
//                 return res.status(401).json({
//                     message: `Invalid token, please login first`
//                 })
//             }

//             if(decoded){
//                 req.body.name = decoded.name
//                 req.body.role = decoded.role

//                 next()
//             }
//         })
//     } catch (error) {
//         res.status(500).json({message: `Internal server error ${error.message}`})
//     }
// }

// module.exports = authentication;


require("dotenv").config();
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header missing or malformed",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token, please login again",
          success: false,
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({
      message: `Internal server error: ${error.message}`,
      success: false,
    });
  }
};

module.exports = authentication;
