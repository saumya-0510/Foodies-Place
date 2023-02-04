const express=require('express');

const bookingRouter=express.Router();
const {protectRoute}=require('../controller/authController');
const {createSession}=require('../controller/bookingController');
bookingRouter.post('/createSession',protectRoute,createSession);
bookingRouter.get('/createSession',function(req,res){
    res.sendFile("D:/projects/Web Dev projects/Full Stack Learning/Backend/foodApp/view/booking.html");
});

module.exports=bookingRouter;