//WIP
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../auth");
//Request Model

const Request = require("../models/request.js");

//User Model

const User = require("../models/user.js");
//Add Request

router.post("/addRequest", ensureAuthenticated, async (req, res) => {
	const { title, description, budget, status, dateCreated } = req.body;
	let errors = [];
	//Check required fields
	if (!title || !description || !budget || !status) {
		errors.push({ msg: "Please fill in all fields" });
	}
	//Check valid input in fields
	if (isNaN(budget) || typeof budget === "boolean") {
		errors.push({
			msg: "Please fill all the fields with the valid input"
		});
	}
	if (errors.length !== 0) {
		res.send(errors);
	} else {
		//Validation passed
		const request = new Request({
			...req.body,
			owner: req.user._id,
			boss_owner: req.user.buyerInfo.boss._id
		});

		try {
			await request.save();
			res.status(201).send(request);
		} catch (e) {
			/* handle error */
			res.status(400).send(e);
		}
	}
});

//Accept Request as a Boss and transfer to financer (WIP)
router.post("/acceptRequest", ensureAuthenticated, async (req, res) => {
	res.send("hey");
});
module.exports = router;
