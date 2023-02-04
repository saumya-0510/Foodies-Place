

const userModel = require("../models/userModel");

module.exports.getUser = async function getUser(req, res) {
    // console.log(req.query);
    // let allUsers = await userModel.find();
    let id = req.id;
    let user = await userModel.findById(id);
    if (user) {
        return res.json(user);
    } else {
        return res.json({
            message: "User not found",
        });
    }
    // res.json({
    //     message: "List of All Users", 
    //     data : user
    // });
}

module.exports.updateUser = async function updateUser(req, res) {

    try {
        let id = req.params.id;
        let user = await userModel.findById(id);
        console.log(user);
        let dataToBeUpdated = req.body;
        if (user) {
            const keys = [];
            for (let key in dataToBeUpdated) {
                keys.push(key);
            }

            for (let i = 0; i < keys.length; i++) {
                // console.log(keys[i]);
                user[keys[i]] = dataToBeUpdated[keys[i]];
            }
            // Bcz it requires confirm Password for validation at the time of sending request
            user.confirmPassword = user.password;
            const updatedData = await user.save();
            res.json({
                message: "Data updated successfully",
                data: updatedData
            });
        } else {
            res.json({
                message: "User not found"
            })
        }
    }
    catch (e) {
        res.json({
            message: e.message
        })
    }


}

module.exports.deleteUser = async function deleteUser(req, res) {
    try {
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete(id);
        if (!user) {
            res.json({
                message: "User not found"
            })
        }
        res.json({
            message: "Data has been deleted",
            data: user
        });
    }
    catch (e) {
        res.json({
            message: e.message
        })
    }

}

module.exports.getAllUsers = async function getAllUsers(req, res) {
    try {
        let users = await userModel.find();
        if (users) {
            res.json({
                message: "Users retrieved",
                data: users
            })
        } else {
            res.json({
                message: "Users not found"
            })
        }
    }
    catch (e) {
        res.json({
            message: e.message
        })
    }
}

module.exports.updateProfileImage = function updateProfileImage(req, res) {
    res.json({
        message: 'File uploaded succesfully'
    });
}





