const jwt = require("jsonwebtoken");
const JWT_KEY = require("../secrets.js")

function protectRoute(req, res, next){
    if(req.cookies.login){
        // Verify the signature
        let isVerified = jwt.verify(req.cookies.login, JWT_KEY);
        if(isVerified){
            next();
        }else{
            return res.json({
                message: "User not verified"
            });
        }
        
    }else{
        return res.json({
            message: "Please log in. Operation not allowed."
        });
    }
}

module.exports = protectRoute;