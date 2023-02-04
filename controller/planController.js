const planModel = require("../models/planModel");

module.exports.getAllPlans = async function getAllPlans(req, res) {
    try {
        let plans = await planModel.find();
        if (plans) {
            return res.json({
                message: "All plans retrieved",
                data: plans
            });
        } else {
            return res.json({
                message: "Plans not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports.getPlan = async function getPlan(req, res) {
    try {
        let id = req.params.id;
        console.log(id);
        let plan = await planModel.findById(id);
        if (plan) {
            console.log(plan);
            return res.json({
                message: "Plan retrieved",
                data: plan
            });
        } else {
            return res.json({
                message: "Plan not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports.createPlan = async function createPlan(req, res) {
    try {
        let planData = req.body;
        let createdPlan = await planModel.create(planData);
        return res.json({
            message: "Plan created succesfully",
            data: createdPlan
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports.deletePlan = async function deletePlan(req, res) {
    try {
        let id = req.params.id;
        let deletedPlan = await planModel.findByIdAndDelete(id);
        return res.json({
            message: "Plan deleted succesfully",
            data: deletedPlan
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports.updatePlan = async function (req, res) {
    try {
        let id = req.params.id;
        let dataToBeUpdated = req.body;
        // console.log(id);
        // console.log(dataToBeUpdated);
        let keys = [];
        for (let key in dataToBeUpdated) {
            keys.push(key);
        }
        // console.log(dataToBeUpdated);
        // console.log(keys);
        let plan = await planModel.findById(id);
        for (let key in keys) {
            // console.log(key);
            plan[keys[key]] = dataToBeUpdated[keys[key]];
            // console.log(dataToBeUpdated[key]);
            // console.log(plan[key]);
        }
        // console.log(plan);
        //doc
        plan = await plan.save();
        
        return res.json({
            message: "Plan updated succesfully",
            data: plan
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

//Get top 3 plans

module.exports.top3Plans = async function top3Plans(req, res) {
    try {
        const plans = await planModel
            .find()
            .sort({
                ratingsAverage: -1
            })
            .limit(3);
        return res.json({
            message: "Top 3 plans",
            data: plans
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
