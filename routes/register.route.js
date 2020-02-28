const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../auth");
//User Model
const User = require("../models/user");
var minlength = 8;
//Register Buyer
router.post("/register/buyer", (req, res) => {
	const {
		name,
		last_name,
		email,
		password,
		password2,
		type,
		status,
		buyerInfo
	} = req.body;
	let errors = [];
	//Check required fields
	if (
		!name ||
		!last_name ||
		!email ||
		!password ||
		!password2 ||
		!buyerInfo
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
					type: "Buyer",
					buyerInfo: buyerInfo
				});
				console.log(newUser);
				res.send("new Buyer Added");
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
//Register Boss
router.post("/register/boss", (req, res) => {
	const {
		name,
		last_name,
		email,
		password,
		password2,
		type,
		bossInfo
	} = req.body;
	let errors = [];
	//Check required fields
	if (
		!name ||
		!last_name ||
		!email ||
		!password ||
		!password2 ||
		!bossInfo
	) {
		errors.push({ msg: "Please fill in all fields" });
	}

	//Check if Passwords Match
	if (password !== password2) {
		errors.push({ msg: "Passwords do not match" });
	}

	//Check password minimum length is fulfilled
	if (password.length < minlength) {
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
		Boss.findOne({ email: email }).then(user => {
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
					type: "Boss",
					bossInfo: bossInfo
				});
				console.log(newUser);
				res.send("new Boss Added");
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
									 * ); */
									res.redirect(
										"/users/login"
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
//Register Financer
router.post("/register/financer", (req, res) => {
	const {
		name,
		last_name,
		email,
		password,
		password2,
		type,
		financerInfo
	} = req.body;
	let errors = [];
	//Check required fields
	if (
		!name ||
		!last_name ||
		!email ||
		!password ||
		!password2 ||
		!financerInfo
	) {
		errors.push({ msg: "Please fill in all fields" });
	}

	//Check if Passwords Match
	if (password !== password2) {
		errors.push({ msg: "Passwords do not match" });
	}
	//Check if password fulfills the minimum length requirement
	if (password.length < minlength) {
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
		Financer.findOne({ email: email }).then(user => {
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
					type: "Financer",
					financerInfo: financerInfo
				});
				console.log(newUser);
				res.send("new Financer Added: ");
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
									req.flash(
										"success_msg",
										"Success! User successfully registered!"
									);
									console.log(
										"User Saved"
									);
									res.redirect(
										"/users/login"
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
