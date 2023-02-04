const express = require("express");
// const app = express();
const { update } = require("lodash");
const multer = require("multer");
const userRouter = express.Router();
const { getUser, getAllUsers, updateUser, deleteUser, updateProfileImage } = require("../controller/userController");

const { signup, login, isAuthorised, protectRoute, logout, forgetpassword, resetpassword } = require("../controller/authController");

// Options available to users
userRouter.route('/:id')
    .patch(updateUser)
    .delete(deleteUser)

userRouter
    .route("/signup")
    .post(signup)

userRouter
    .route("/login")
    .post(login)

userRouter
    .route('/forgetpassword')
    .post(forgetpassword)

userRouter
    .route('/resetpassword/:token')
    .post(resetpassword)

userRouter
    .route('/logout')
    .get(logout)

// Multer for file upload
// upload -> storage , filter
const multerStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "D:/projects/Web Dev projects/Full Stack Learning/Backend/foodApp/public/images")
    },
    filename: function (req, file, callback) {
        callback(null, `user-${Date.now()}.jpeg`)
    }
})

const filter = function (req, file, callback) {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(new Error("Not an image. Please upload an image"), false);
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: filter
})

userRouter.post("/ProfileImage", upload.single('photo'), updateProfileImage);
//Get request
userRouter.get('/ProfileImage', (req, res) => {
    res.sendFile("D:/projects/Web Dev projects/Full Stack Learning/Backend/foodApp/view/multer.html");
});


// Profile page
userRouter.use(protectRoute);

userRouter
    .route("/userProfile")
    .get(getUser)

// Admin specific function
userRouter.use(isAuthorised(['admin']));
userRouter
    .route("/")
    .get(getAllUsers)


module.exports = userRouter;