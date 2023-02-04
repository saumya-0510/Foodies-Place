const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const JWT_KEY = require('../secrets.js');
authRouter
.route("/signup")
.get(middleware, getSignUp)
.post(postSignUp);

authRouter
.route('/login')
.post(loginUser);

function middleware(req, res, next){
    console.log("middleware encountered");
    next();
}


function getSignUp(req, res, next){
    
    // res.sendFile('/public/index.html', {root:__dirname});
    next();
}

async function postSignUp(req, res){
    // let obj = req.body;
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    // console.log("backend", obj);
    res.json({
        message: "User Signed Up",
        data : user
    });
}

async function loginUser(req, res){
    try{
        let data = req.body;
        if(data.email){
            let user = await userModel.findOne({email:data.email});
            if(user){
                //bcrypt => compare
                if(user.password == data.password){
                    // res.cookie('isLoggedIn', true, {httpOnly : true});

                    let uid = user['_id']; // unique ID
                    // Default algo used is HMAC SHA256
                    let token = jwt.sign({payload:uid}, JWT_KEY);
                    res.cookie('login', token, {httpOnly:true});
                    return res.json({
                        message: "User has logged in",
                        userDetails : data
                    })
                }else{
                    return res.json({
                        message:"Wrong Credentials"
                    })
                }
            }else{
                return res.json({
                    message: "User not found"
                });
            }
        }
        else{
            return res.json({
                message: "Empty field found"
            })
        }
    }
    catch(e){
        return res.json({
            message : e.message
        })
    }
    
}

module.exports = authRouter;