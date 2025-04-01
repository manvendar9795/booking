const { messages } = require('validatorjs/src/lang');
const resp = require('../controllers/basecontroller');
const JWT = require('jsonwebtoken');
// exports.protect = async (req, res , next ) => {
//     try {
//         let token = req.headers.authorization;

//         if(token && token.startsWith("Bearer")){
//             token = token.split(" ")[1]; // Extract token 
//             const decoded =  jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await UserModel.findByPk(decoded.id).select("-password");
//             next();
//         }else{
//             res.status(401).json(resp.sendError(null, " Not authorized, No token "));
//         }
//     } catch (error) {
//         return res.status(500).send(resp.sendError("somthing went wrong", error.message));
//     }
// }


exports.authmiddleware = async (req, res, next) => {
    try {
      // Check if the authorization header is provided
      if (!req.headers["authorization"]) {
        return res
          .status(401)
          .send(resp.sendError(null, "Authorization header missing"));
      }
  
      // Extract the token (handle improper formatting)
      const authHeader = req.headers["authorization"];
      if (!authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .send(resp.sendError(null, "Invalid Authorization format"));
      }
  
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .send(resp.sendError(null, "Token missing"));
      }
  
      // Verify the token
      JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .send(resp.sendError(null, "Unauthorized User"));
        }
        req.body.id = decoded.id; // Store user id for further use
        next(); // Move to the next middleware
      });
    } catch (error) {
      console.error("JWT ERROR=====================================>", error);
      res.status(400).send(resp.sendError(null, error.message));
    }
  };

exports.isAdmin = function (req, res, next) {
    // Check if user is authenticated and has a role
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next(); // Proceed to the next middleware or route handler
 };