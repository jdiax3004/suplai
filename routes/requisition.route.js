//Libraries
const express = require("express");
const router = express.Router();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

//Methods
const { ensureAuthenticated } = require("../auth");

//Models
const Requisition = require("../models/requisition");
const User = require("../models/user");

//[GET] Read Requisitions
router.get("/requisitions", ensureAuthenticated, async (req, res) => {
	try {
		var requisitions;
		if (req.user.type == "admin") {
			console.log("ADMIN");
			var requisitions = await Requisition.find().populate({
				path: "owner",
				populate: {
					path: "boss"
				}
			});
		} else {
			var requisitions = await Requisition.find({
				owner: req.user._id
			}).populate({
				path: "owner",
				populate: {
					path: "boss"
				}
			});
		}
		return res.status(200).json(requisitions);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

//[GET] Read Requisitions
router.get("/requisitionsChecker", ensureAuthenticated, async (req, res) => {
	try {
		var requisitions = await Requisition.find({
			checker: req.user._id
		}).populate({
			path: "owner",
			populate: {
				path: "boss"
			}
		});

		return res.status(200).json(requisitions);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

//[GET] Read a Requisition
router.get("/requisitions/:id", ensureAuthenticated, async (req, res) => {
	try {
		var requisition;
		if (req.user.type == "admin") {
			console.log("ADMIN");
			requisition = await Requisition.findById(
				req.params.id
			).populate({
				path: "owner",
				populate: {
					path: "boss"
				}
			});
		} else {
			requisition = await Requisition.findById(
				req.params.id
			).populate({
				path: "owner",
				populate: {
					path: "boss"
				}
			});
		}
		return res.status(200).json(requisition);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

//[POST] Create Requisitions
router.post("/requisition", ensureAuthenticated, (req, res) => {
	const { title, description, budget } = req.body;
	let errors = [];

	//Check required fields
	if (!title || !description || !budget) {
		errors.push({ msg: "Please fill in all fields" });
	}

	if (errors.length !== 0) {
		res.status(400).send(errors);
	} else {
		const newReq = new Requisition({
			title: title,
			description: description,
			budget: budget,
			owner: req.user._id,
			checker: req.user.boss._id
		});
		newReq.save()
			.then(req => {
				//TODO
				/* console.log(newReq); */
				res.send("New Requisition Added: " + title);
				sendNewRequisition(newReq);
				notifyBossNewRequisition(newReq);
			})
			.catch(err => console.log(err));
	}
});

// [PUT] Update Requisition
router.put("/requisition/:id", async (req, res) => {
	try {
		const requesition = await Requisition.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true
			}
		);
		if (!requesition) {
			res.status(404).send();
		}
		res.send(requesition);
	} catch (error) {
		res.status(404).send(e);
	}
});

// [PUT] Update User
router.put("/requisitionFinancer/:id", async (req, res) => {
	try {
		var budget = req.body.budget;
		var tierUser = "";

		if (budget <= 100000) {
			tierUser = "1";
		} else if (budget > 100000 || budget <= 1000000) {
			tierUser = "2";
		} else {
			tierUser = "3";
		}
		console.log(budget);
		console.log(tierUser);

		const financerID = await User.findOne(
			{ tier: tierUser },
			function(err, docs) {}
		);

		console.log(financerID._id);
		const requesition = await Requisition.findByIdAndUpdate(
			req.params.id,
			{ checker: financerID._id },
			{
				new: true
			}
		);
		if (!requesition) {
			res.status(404).send();
		}
		res.send(requesition);
	} catch (error) {
		res.status(404).send(error);
	}
});

// [DELETE] Delete User
router.delete("/requisition/:id", async (req, res) => {
	try {
		const requisition = await Requisition.findByIdAndDelete(
			req.params.id
		);
		if (!requisition) {
			res.status(404).send();
		}
		res.send("Requisition Deleted: " + requisition.title);
	} catch (error) {
		res.status(404).send(e);
	}
});

//Notify Buyer of requisition creation
async function sendNewRequisition(newReq) {
	const owner = await User.findById(newReq.owner._id);
	const requisitionurl =
		"http://localhost:4200/requisicion/" + newReq._id;
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
	const outputnewreq = `
									<h3>Hola, ${owner.name}</h3>
									<p>Hemos registrado su nueva requisicion en el sistema:</p>
									<p>ID Requisicion: ${newReq._id}</p>
									<p>En las proximas horas, va a recibir actualizaciones correspondientes a dicha orden. No olvide revisar constantemente su correo para obtener las ultimas noticias sobre su requisicion</p>
									<p>Para obtener mas detalles sobre esta requisicion, puede ingresar al siguiente enlace:</p>
									<p>${requisitionurl}</p>
									<h4>Estamos para Servirle,</h4>
									<p>Equipo de Suplai</p>
									`;
	let info = transporter.sendMail({
		from: '"Equipo de Suplai " ' + emailsuplai, // sender address
		to: owner.email, // list of receivers
		subject:
			owner.name +
			", Ha creado una Requisicion nueva. [ID:" +
			newReq._id +
			"]", // Subject line
		/* text:
		 *         "", */
		// plain text body

		html: outputnewreq // html body
	});
	console.log("Message sent: %s", info.messageId);
	// Message sent: <blabla@example.com>
}
async function notifyBossNewRequisition(newReq) {
	const checker = await User.findById(newReq.checker._id);
	const buyer = await User.findById(newReq.owner._id);
	const emailsuplai = "noreplysuplaicr@gmail.com";
	const requisitionurl =
		"http://localhost:4200/requisicion/" + newReq._id;
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
	const outputnewreq = `
									<h3>Hola, ${checker.name}</h3>
									<p>Hemos notado que el Comprador ${buyer.name} [${buyer._id}] a creado una nueva solicitud: </p>
									<p>(Titulo: ${newReq.title}):</p>
									<p>ID Requisicion: ${newReq._id}</p>
									<p>Para proceder a evaluar esta solicitud con mayor detalle, puede ingresar al siguiente enlace:</p>
									<p>${requisitionurl}</p>
									<h4>Estamos para Servirle,</h4>
									<p>Equipo de Suplai</p>
									`;
	let info = transporter.sendMail({
		from: '"Equipo de Suplai " ' + emailsuplai, // sender address
		to: checker.email, // list of receivers
		subject:
			checker.name +
			", Un comprador ha creado una requisicion nueva. [ID:" +
			newReq._id +
			"]", // Subject line
		/* text:
		 *         "", */
		// plain text body

		html: outputnewreq // html body
	});
	console.log("Message sent: %s", info.messageId);
	// Message sent: <blabla@example.com>
}
module.exports = router;
