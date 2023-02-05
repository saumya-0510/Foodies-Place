const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
var cors = require("cors");
app.use(express.static('public/build'));

// Middleware function => POST
// Frontend json to JS object
app.use(express.json());
const port=process.env.PORT || 3000;
app.listen(port,function(){
    console.log(`server listening on port ${port}`); 
});
app.use(cookieParser());

// Array of objects
// let users=[
//     {
//         'id' : 1,
//         'name' : "Abhi"
//     },
//     {
//         'id':2,
//         'name' : "Sam"
//     },
//     {
//         'id' : 3,
//         'name' : 'Kartik'
//     }

// ];

//Mini - app
const userRouter = require("./Routers/userRouter");
const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");
const bookingRouter = require("./Routers/bookingRouter");

// base router, router to use
app.use('/user', userRouter);
app.use("/plans", planRouter);
app.use("/reviews", reviewRouter);
app.use("/booking", bookingRouter);


