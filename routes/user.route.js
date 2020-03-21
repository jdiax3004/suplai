//Libraries
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//Methods
const { ensureAuthenticated } = require("../auth");

//Models
const User = require("./../models/user.js");

//[GET] Read a Specific User
router.get("/users/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		return res.status(200).json(user);
	} catch {
		res.status(500).json({ message: err.message });
	}
});

//[GET] Read a Specific User with a Filter
router.get("/userFilter", async (req, res) => {
	try {
		var queryParameter = req.query;
		//TYPE FILTER
		if (queryParameter.type) {
			const result = await User.find(
				{ type: queryParameter.type },
				"name last_name",
				function(err, docs) {}
			);
			return res.status(200).json(result);
		}
	} catch {
		res.status(500).json({ message: err.message });
	}
});

//[GET] Read Users
router.get("/users", async (req, res) => {
	try {
		const allUsers = await User.find().populate("boss");
		return res.status(200).json(allUsers);
	} catch {
		res.status(500).json({ message: err.message });
	}
});

// [POST] Create User
router.post("/register", (req, res) => {
	const { name, last_name, email, password, type, boss, tier } = req.body;
	let errors = [];

	//Check required fields
	if (!name || !last_name || !email || !password || !type) {
		errors.push({ msg: "Please fill in all fields" });
	}

	if (password.length < 8) {
		errors.push({
			msg:
				"Password must be composed of at least 8 characters"
		});
	}
	if (email == password) {
		errors.push({
			msg: "Password cannot be the same as email"
		});
	}
	if (errors.length !== 0) {
		res.status(400).send(errors);
	} else {
		//Validation Passed
		User.findOne({ email: email }).then(user => {
			if (user) {
				//User Exists
				errors.push({
					msg: "The email is already registered"
				});
				res.status(400).send(errors);
			} else {
				const newUser = new User({
					name: name,
					last_name: last_name,
					email: email,
					password: password,
					type: type,
					boss: boss,
					tier: tier
				});
				//Hash Password
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(
						newUser.password,
						salt,
						(err, hash) => {
							//Set Password to hashed
							if (err) throw err;
							newUser.password = hash;
							//Save User
							newUser.save()
								.then(user => {
									//TODO
									console.log(
										newUser
									);
									res.send(
										"New User Added: " +
											email
									);
								})
								.catch(err =>
									console.log(
										err
									)
								);
						}
					)
				);
			}
		});
	}
});

// [PUT] Update User
router.put("/user/:id", async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true
			}
		);
		if (!user) {
			res.status(404).send();
		}
		res.send(user);
	} catch (error) {
		res.status(404).send(e);
	}
});

// [DELETE] Delete User
router.delete("/user/:id", async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			res.status(404).send();
		}
		res.send("User Deleted: " + user.email);
	} catch (error) {
		res.status(404).send(e);
	}
});

//[GET] Logout User
router.get("/logout", (req, res) => {
	req.logout();
	//Cambiar de rutas al front end nuestro *POR HACER
	/* res.redirect("users/login"); */
	res.send("logout!");
});

//[GET] Logout User
router.get("/current", (req, res) => {
	res.json(req.user);
});

//[POST] Login User
router.post("/login", function(req, res, next) {
	passport.authenticate("local", function(err, user, info) {
		if (err) {
			return res.status(501).json(err);
		}
		if (!user) {
			return res.status(501).json(info);
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.status(501).json(err);
			}
			return res.status(200).json(user);
		});
	})(req, res, next);
});

module.exports = router;
