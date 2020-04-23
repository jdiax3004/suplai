//Libraries
const express = require("express");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const router = express.Router();
const bodyParser = require("body-parser");
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
									res.status(
										201
									).json(
										user
									);
									sendWelcome(
										user
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
		var { name, last_name, email, password, status } = req.body;

		let errors = [];

		//Check required fields
		if (!name || !last_name || !email || !password || !status) {
			errors.push({
				msg: "Por favor llene todos los campos"
			});
		}
		if (errors.length !== 0) {
			//Validation not Passed. Send errors to client
			res.send(errors);
		} else {
			if (password) {
				password = await bcrypt.hash(password, 10);
			}
			var user = await User.findByIdAndUpdate(
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
			sendUpdateNotification(user);
		}
	} catch (error) {
		console.log(error);
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

//[GET] Current User
router.get("/current", (req, res) => {
	res.json(req.user);
});

//[POST] Login User
router.post("/login", passport.authenticate("local"), (req, res) => {
	return res.status(200).send(req.user);
});

//Automated Welcome Email
function sendWelcome(user) {
	const emailsuplai = "noreplysuplaicr@gmail.com";
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: "noreplysuplaicr@gmail.com", // generated ethereal user
			pass: "suplainoreply123" // generated ethereal password
		}
	});
	// send mail with defined transport object
	const outputwelcome = `
									<h3>Hola, ${user.name}</h3>
									<p>Le damos una bienvenida por parte del equipo de Suplai. Estamos felices de que haya escogido nuestros servicios. Esperemos que pueda tener una experiencia increible en nuestra plataforma.</p>
									<h4>Estamos para Servirle,</h4>
									<p>Equipo de Suplai</p>
									`;
	let info = transporter.sendMail({
		from: '"Equipo de Suplai " <' + emailsuplai + ">", // sender address
		to: user.email, // list of receivers
		subject: "Bienvenido, " + user.name, // Subject line
		/* text:
		 *         "", */
		// plain text body

		html: outputwelcome // html body
	});
	console.log("Message sent: %s", info.messageId);
	// Message sent: <blabla@example.com>
}
//Automated Notification Regarding User Modifications
function sendUpdateNotification(user) {
	const userprofileurl = "http://localhost:4200/usuario/" + user._id;
	const emailsuplai = "noreplysuplaicr@gmail.com";
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: "noreplysuplaicr@gmail.com", // generated ethereal user
			pass: "suplainoreply123" // generated ethereal password
		}
	});
	// send mail with defined transport object
	const outputwelcome = `
									<h3>Hola, ${user.name}</h3>
									<p>Hemos notado que se han realizado cambios recientes a su informacion de usuario. Para mayor informacion, haga click en el siguiente enlace:</p>
									<p>${userprofileurl}</p>
									<h4>Estamos para Servirle,</h4>
									<p>Equipo de Suplai</p>
									`;
	let info = transporter.sendMail({
		from: '"Equipo de Suplai " <' + emailsuplai + ">", // sender address
		to: user.email, // list of receivers
		subject: "Bienvenido, " + user.name, // Subject line
		/* text:
		 *         "", */
		// plain text body

		html: outputwelcome // html body
	});
	console.log("Message sent: %s", info.messageId);
	// Message sent: <blabla@example.com>
}

module.exports = router;
