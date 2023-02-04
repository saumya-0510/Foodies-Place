// MongoDB
const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db_link = 'mongodb+srv://erebusL:7jR2kppKBlhF8bCV@cluster0.fv1s0mj.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
    .then(function (db) {
        console.log("User DB connected");
        //console.log(db);
    })
    .catch(function (err) {
        console.log(err);
    });

// Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            return emailValidator.validate(this.email);
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    confirmPassword: {
        type: String,
        required: true,
        minLength: 8,
        validate: function () {
            return this.confirmPassword == this.password;
        }
    },
    role: {
        type: String,
        enum: ["admin", "user", "restaurantowner", "deliveryboy"],
        default: "user"
    },
    profileImage: {
        type: String,
        default: "img/users/default.jpeg"
    },
    resetToken: String
});

// Hooks

// Hooks to not save confirmPassword field
userSchema.pre('save', function () {
    this.confirmPassword = undefined;
});

// userSchema.pre('save', async function(){
//     let salt = await bcrypt.genSalt();
//     let hashedString = await bcrypt.hash(this.password, salt);
//     // console.log(hashedString);
//     this.password = hashedString;
// });
userSchema.methods.createResetToken = function () {
    //creating unique token using npm i crypto
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function (password, confirmPassword) {
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined;
}

// Model
const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
