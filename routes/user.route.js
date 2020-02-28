const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../auth");
//User Model
const User = require("./../models/user");

//Login
router.get("/login", (req, res) => res.send("Login"));

//Register Page

//See all Users
router.get("/seeuser", async (req, res) => {
	try {
		const allUsers = await User.find();
		return res.status(200).json(allUsers);
	} catch {
		res.status(500).json({ message: err.message });
	}
});
//Welcome Page
router.get("/", (req, res) => res.send("Welcome!"));

//Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
	res.send("dashboard")
);

/* //Register
 * router.post("/register", (req, res) => {
 *         const {
 *                 name,
 *                 last_name,
 *                 email,
 *                 password,
 *                 password2,
 *                 type,
 *                 status,
 *                 reqList
 *         } = req.body;
 *         let errors = [];
 *         //Check required fields
 *         if (!name || !last_name || !email || !password || !password2) {
 *                 errors.push({ msg: "Please fill in all fields" });
 *         }
 *
 *         if (password !== password2) {
 *                 errors.push({ msg: "Passwords do not match" });
 *         }
 *
 *         if (password.length < 8) {
 *                 errors.push({
 *                         msg:
 *                                 "Password must be composed of at least 8 characters"
 *                 });
 *         }
 *         if (email == password) {
 *                 errors.push({
 *                         msg: "Password cannot be the same as email"
 *                 });
 *         }
 *         if (errors.length !== 0) {
 *                 res.send("register", {
 *                         errors,
 *                         name,
 *                         last_name,
 *                         email,
 *                         type,
 *                         password
 *                 });
 *                 res.send(errors);
 *         } else {
 *                 //Validation Passed
 *                 User.findOne({ email: email }).then(user => {
 *                         if (user) {
 *                                 //User Exists
 *                                 errors.push({
 *                                         msg: "The email is already registered"
 *                                 });
 *                                 res.send("register", {
 *                                         errors,
 *                                         name,
 *                                         last_name,
 *                                         email,
 *                                         type,
 *                                         password
 *                                 });
 *                         } else {
 *                                 const newUser = new User({
 *                                         name: name,
 *                                         last_name: last_name,
 *                                         email: email,
 *                                         password: password,
 *                                         type: type,
 *                                         status: true,
 *                                         reqList: []
 *                                 });
 *                                 console.log(newUser);
 *                                 res.send("new User Added");
 *                                 //Hash Password
 *                                 bcrypt.genSalt(10, (err, salt) =>
 *                                         bcrypt.hash(
 *                                                 newUser.password,
 *                                                 salt,
 *                                                 (err, hash) => {
 *                                                         //Set Password to hashed
 *                                                         if (err) throw err;
 *                                                         newUser.password = hash;
 *                                                         //Save User
 *                                                         newUser.save()
 *                                                                 .then(user => {
 *                                                                         req.flash(
 *                                                                                 "success_msg",
 *                                                                                 "Success! User successfully registered!"
 *                                                                         );
 *                                                                         res.redirect(
 *                                                                                 "/users/login"
 *                                                                         );
 *                                                                 })
 *                                                                 .catch(err =>
 *                                                                         console.log(
 *                                                                                 err
 *                                                                         )
 *                                                                 );
 *                                                 }
 *                                         )
 *                                 );
 *                         }
 *                 });
 *         }
 * }); */

//Login Handle
/* router.post("/login", (req, res, next) => {
 *         passport.authenticate("local", {
 *                 successRedirect: "/dashboard",
 *                 failureRedirect: "/users/login"
 *         })(req, res, next);
 * }); */

//User Login
router.post("/login", passport.authenticate("local"), (req, res) => {
	res.status(200).send({ data: req.user });
});

/*See User Profile*/
router.get("/profile", ensureAuthenticated, (req, res) => {
	res.send(req.user);
});
/*List All Requests of a certain Buyer as a Boss*/
router.post("/buyer/request/list", ensureAuthenticated, async (req, res) => {
	const buyer = await User.findById(req.body.buyerID);
	console.log(req.body.buyerID);
	await buyer.populate("requests").execPopulate();
	console.log(buyer.requests);
	res.send(buyer.requests);
});
/* List All Requests as a Buyer */
router.get("/request/list", ensureAuthenticated, async (req, res) => {
	const buyer = await User.findById(req.user._id);
	await buyer.populate("requests").execPopulate();
	console.log(buyer.requests);
	res.send(buyer.requests);
});
/* List All Buyers as a  Boss */
router.get("/buyer/list", ensureAuthenticated, async (req, res) => {
	const boss = await User.findById(req.user._id);
	await boss.populate("buyers").execPopulate();
	console.log(boss.buyers);
	res.send(boss.buyers);
});

/* List All Bosses as a Financer */
router.get("/boss/list", ensureAuthenticated, async (req, res) => {
	const financer = await User.findById(req.user._id);
	await financer.populate("bosses").execPopulate();
	console.log(financer.bosses);
	res.send(financer.bosses);
});
//Logout Handle

router.get("/logout", (req, res) => {
	req.logout();
	//Cambiar de rutas al front end nuestro *POR HACER
	/* res.redirect("users/login"); */
	res.send("logout!");
});
module.exports = router;
