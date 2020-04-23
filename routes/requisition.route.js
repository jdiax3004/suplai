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
  console.log(req.user.type)
	try {
    var requisitions;
    if (req.user.type.toUpperCase()== "ADMIN") {
      var requisitions = await Requisition.find().populate({
        path: "owner",
        populate: {
          path: "boss"
        }
      });
    } else if (req.user.type.toUpperCase() == "BUYER") {
      var requisitions = await Requisition.find({
        owner: req.user._id
      }).populate({
        path: "owner",
        populate: {
          path: "boss"
        }
      });
    } else {
      var requisitions = await Requisition.find({
        checker: req.user._id
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

//[GET] Read a Specific Requisition
router.get("/requisitions/:id", ensureAuthenticated, async (req, res) => {
	try {
		const requisition = await Requisition.findById(
			req.params.id
		).populate({
			path: "owner",
			populate: {
				path: "boss"
			}
		});
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
				res.status(201).json(
					"New Requisition Added: " + title
				);
				sendNewRequisition(newReq);
				notifyBossNewRequisition(newReq);
			})
			.catch(err => console.log(err));
	}
});

// [PUT] Update Requisition
router.put("/requisition/:id", ensureAuthenticated, async (req, res) => {
	try {
		//Assign Financer Logic
		console.log("Jili");
		console.log(req.user.type);
		console.log("Jili");
		if (req.user.type == "BOSS") {
			const budgetData = await Requisition.findById(
				req.params.id,
				"budget",
				function(err, docs) {}
			);

			var tierUser = "";

			const budget = budgetData.budget;
			if (budget <= 100000) {
				console.log("banda 1");
				tierUser = "1";
			} else if (budget > 100000 || budget <= 1000000) {
				console.log("banda 2");
				tierUser = "2";
			} else {
				console.log("banda 3");
				tierUser = "3";
			}

			const financerID = await User.findOne(
				{ tier: tierUser },
				function(err, docs) {}
			);

			const requisition = await Requisition.findByIdAndUpdate(
				req.params.id,
				{
					checker: financerID._id,
					status: req.body.status
				},
				{
					new: true
				}
			);

			if (!requisition) {
				res.status(404).send();
			}

			res.send(requisition);
			notifyRequisitionUpdate(requisition);
		} else {
			// FINANCER & ADMIN
			const requisition = await Requisition.findByIdAndUpdate(
				req.params.id,
				req.body,
				{
					new: true
				}
			);
			if (!requisition) {
				res.status(404).send();
			}
			res.send(requisition);
			notifyRequisitionUpdate(requisition);
		}
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
//Notify Boss about new requisition
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
//Notify Buyer about a Requisition Update
async function notifyRequisitionUpdate(requisition) {
	const checker = await User.findById(requisition.checker._id);
	const buyer = await User.findById(requisition.owner._id);
	const isDenied = requisition.status === 3 ? "Denegada" : "Aprobada";
	const isBoss =
		checker.type === "BOSS"
			? "Jefe Aprobador"
			: "Aprobador Financiero";
	const emailsuplai = "noreplysuplaicr@gmail.com";
	const requisitionurl =
		"http://localhost:4200/requisicion/" + requisition._id;
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
	const outputaboutrequest = `
									<h3>Hola ${buyer.name},</h3>
									<p>Hay novedades con respecto a su requisicion [ID: ${requisition._id}],</p>
									<p>Le informamos que su requisicion ha sido ${isDenied} por el ${isBoss} '${checker.name} [ID: ${checker._id}]' </p>
									<p>(Titulo: ${requisition.title}):</p>
									<p>ID Requisicion: ${requisition._id}</p>
									<p>Estado:<strong>${isDenied} por ${isBoss} ${checker.name} [ID: ${checker._id}] </strong> </p>
									<p>Para proceder a evaluar esta solicitud con mayor detalle, puede ingresar al siguiente enlace:</p>
									<p>${requisitionurl}</p>
									<h4>Estamos para Servirle,</h4>
									<p>Equipo de Suplai</p>
									`;
	let info = transporter.sendMail({
		from: '"Equipo de Suplai " ' + emailsuplai, // sender address
		to: buyer.email, // list of receivers
		subject:
			checker.name +
			", Novedades sobre su requisicion [ID:" +
			requisition._id +
			"]", // Subject line
		/* text:
		 *         "", */
		// plain text body

		html: outputaboutrequest // html body
	});
	console.log("Message sent: %s", info.messageId);
	// Message sent: <blabla@example.com>
}

module.exports = router;
