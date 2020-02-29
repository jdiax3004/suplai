const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../auth");
//User Model
const User = require("../models/user");
var minlength = 8;
//Register User
router.post("/register", (req, res) => {
	const {
		name,
		last_name,
		email,
		password,
		password2,
		type,
		status,
		buyerInfo,
		bossInfo,
		financerInfo
	} = req.body;
	let errors = [];
	//Check required fields
	if (
		(!name ||
		!last_name ||
		!email ||
		!password ||
		!password2) &&
		(!buyerInfo||!bossInfo||!financerInfo)
	) {
		errors.push({ msg: "Please fill in all fields" });
	}
	//Check if Passwords Match
	if (password !== password2) {
		errors.push({ msg: "Passwords do not match" });
	}
	//Check if password minimum length is reached
	if (password.length < 8) {
		errors.push({
			msg:
				"Password must be composed of at least 8 characters"
		});
	}
	//Check if email is not the same as password
	if (email == password) {
		errors.push({
			msg: "Password cannot be the same as email"
		});
	}
	if (errors.length !== 0) {
		//Validation not Passed. Send errors to client
		res.send(errors);
	} else {
		//Validation Passed
		User.findOne({ email: email }).then(user => {
			if (user) {
				//User Exists
				errors.push({
					msg: "The email is already registered"
				});
				res.send(errors);
			} else {
				const newUser = new User({
					name: name,
					last_name: last_name,
					email: email,
					password: password,
					type:type,
					buyerInfo: buyerInfo,
					bossInfo:bossInfo,
					financerInfo:financerInfo
				});
				console.log(newUser);
				res.send("new User Added");
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
									/* req.flash(
									 *         "success_msg",
									 *         "Success! User successfully registered!"
									 * );
									 * res.redirect(
									 *         "/users/login"
									 * ); */
									res.send(
										"Buyer Successfully Added!"
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

module.exports = router;
