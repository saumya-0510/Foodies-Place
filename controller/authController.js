const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const {sendMail} = require("../utility/nodemailer")
const { JWT_KEY } = require('../secrets.js');


//Sign up user
module.exports.signup = async function signup(req, res) {
    // let obj = req.body;
    try {
        let dataObj = req.body;
        let user = await userModel.create(dataObj);
        // console.log("backend", obj);
        sendMail("signup", user);
        if (user) {
            return res.json({
                message: "User Signed Up",
                data: user
            });
        }
        else {
            return res.json({
                message: "Error while signing up",
            })
        }

    }
    catch (e) {
        res.status(500).json({
            message: e.message,
        })
    }
}

// Login user
module.exports.login = async function login(req, res) {
    try {
        let data = req.body;
        if (data.email) {
            let user = await userModel.findOne({ email: data.email });
            if (user) {
                //bcrypt => compare
                if (user.password == data.password) {
                    // res.cookie('isLoggedIn', true, {httpOnly : true});

                    let uid = user['_id']; // unique ID
                    // Default algo used is HMAC SHA256
                    let token = jwt.sign({ payload: uid }, JWT_KEY);
                    res.cookie('login', token, { httpOnly: true });
                    return res.json({
                        message: "User has logged in",
                        userDetails: data
                    })
                } else {
                    return res.json({
                        message: "Wrong Credentials"
                    })
                }
            } else {
                return res.json({
                    message: "User not found"
                });
            }
        }
        else {
            return res.json({
                message: "Empty field found"
            })
        }
    }
    catch (e) {
        return res.json({
            message: e.message
        })
    }

}

// isAuthorised -> To check the user's role
module.exports.isAuthorised = function isAuthorised(roles) {
    return function (req, res, next) {
        if (roles.includes(req.role) == true) {
            next();
        } else {
            res.status(401).json({
                message: "Operation not allowed"
            })
        }
    }
}

// Protect Route
module.exports.protectRoute = async function protectRoute(req, res, next) {
    let token;
    try {
        if (req.cookies.login) {
            // Verify the signature
            token = req.cookies.login;
            let payload = jwt.verify(token, JWT_KEY);
            //{payload: id}
            if (payload) {
                const user = await userModel.findById(payload.payload);
                req.role = user.role;
                req.id = user.id;
                next();
            }
            else {
                return res.json({
                    message: "Please login again"
                });
            }

        } else {
            // Browser
            let client = req.get('User-Agent')
            if(client.includes("Mozilla")){
                return res.redirect('/login');
            }
            // Postman
            res.json({
                message: "Please login."
            })
        }
    }
    catch (e) {
        return res.json({
            message: e.message
        });
    }
}

// Forget Password
module.exports.forgetpassword = async function forgetpassword(req, res) {
    let { email } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (user) {
            //createResetToken is used to create a new token
            const resetToken = user.createResetToken();
            // http://abc.com/resetpassword/resetToken
            let resetPasswordLink = `${req.protocol}://${req.get("host")}/resetpassword/${resetToken}`;
            //Send email to the user
            //Nodemailer
            let obj = {
                resetPasswordLink: resetPasswordLink,
                email: email
            }
            sendMail("resetpassword", obj);
            return res.json({
                mesage: "Reset password link sent",
                data: resetPasswordLink
            });
        } else {
            return res.json({
                message: "Please signup first",
            });
        }
    } catch (err) {
        res.status(500).json({
            mesage: err.message
        });
    }
};

// resetPassword
module.exports.resetpassword = async function resetpassword(req, res) {
    try {
        const token = req.params.token;
        let { password, confirmPassword } = req.body;
        const user = await userModel.findOne({ resetToken: token });
        if (user) {
            //resetPasswordHandler will update user's password in db
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();
            res.json({
                message: "Password changed succesfully, please login again",
            });
        } else {
            res.json({
                message: "User not found",
            });
        }
    } catch (err) {
        res.json({
            message: err.message,
        });
    }
};

module.exports.logout = function logout(req, res) {
    res.cookie('login', ' ', { maxAge: 1 });
    res.json({
        message: "User logged out succesfully"
    });
}
