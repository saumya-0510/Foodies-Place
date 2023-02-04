let SK = "sk_test_51MXlRsSIeFiiZxdM9k2Gs6G5TzAvpPCJPC4LSUihevQlMwYMLpxotgrLG6NKgBrYYGwsJpMq9MVCwrx9E5MpcB08004oRoRdnH";
const stripe = require('stripe')(SK);
const planModel = require("../models/planModel");
const userModel = require("../models/userModel");

module.exports.createSession = async function createSession(req, res) {
    try {
        let userId = req.id;
        let planId = req.params.id;

        const user = await userModel.findById(userId);
        const plan = await planModel.findById(planId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            client_refernce_id: plan.id,
            line_items: [
                {
                    name: plan.name,
                    description: plan.description,
                    // Deploy website 
                    amount: plan.price,
                    currency: "inr",
                    quantity: 1
                }
            ],
            // dev => http
            // production => https 
            success_url: `${req.protocol}://${req.get("host")}/user/userProfile`,
            cancel_url: `${req.protocol}://${req.get("host")}/user/userProfile`
        })
        res.status(200).json({
            status: "success",
            session
        })
    } catch (err) {
        res.status(500).json({
            err: err.message
        })
    }
}