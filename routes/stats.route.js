//Libraries
//
/**TODO tr0b
	- Presupuesto aprobado en vez de E-mail 
	- Usar la ruta de [GET] userFilter para los stats
	- Crear requisitionsFilter (igual que userFilter)
	- Popular tabla con los pendientes (usar la nueva ruta)
	- Filtro de tiempo = implementación del timestamps [DONE]
	- Fetch de la data con requisitionFIlter + QS usando los timestamps 
	**/
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
//[GET] Read Stats
router.get("/stats", ensureAuthenticated, async (req, res) => {
	console.log(req.user.type);
	try {
		var requisitions;
		if (req.user.type.toUpperCase() == "ADMIN") {
			//If User is Admin
			requisitions = await Requisition.find().populate({
				path: "owner",
				populate: {
					path: "boss"
				}
			});
		} else if (req.user.type.toUpperCase() == "BUYER") {
			//If User is Buyer
			requisitions = await Requisition.find({
				owner: req.user._id
			}).populate({
				path: "owner",
				populate: {
					path: "boss"
				}
			});
		} else {
			//If User is Boss or Financer
			requisitions = await Requisition.find({
				checker: req.user._id
			}).populate({
				path: "owner",
				populate: {
					path: "boss"
				}
			});
		}
		//Total Budget
		const approvedBudget = requisitions.reduce(
			(total, requisition) => {
				return requisition.status == 2
					? total + requisition.budget
					: total;
			},
			0
		);
		//Total Requisitions
		const totalRequisitions = requisitions.length;
		//Total Approved Requisitions
		const totalApprovedRequisitions = requisitions.reduce(
			(total, requisition) => {
				return requisition.status == 2
					? total + 1
					: total;
			},
			0
		);
		//Total Denied Requisitions
		const totalDeniedRequisitions = requisitions.reduce(
			(total, requisition) => {
				return requisition.status == 3
					? total + 1
					: total;
			},
			0
		);
		//Total Pending Requisitions
		const totalPendingRequisitions =
			totalRequisitions -
			(totalApprovedRequisitions + totalDeniedRequisitions);
		return res.status(200).json({
			approvedBudget,
			totalRequisitions,
			totalApprovedRequisitions,
			totalDeniedRequisitions,
			totalPendingRequisitions
		});
	} catch (err) {
		res.status(500).json({
			message: err.message
		});
	}
});
module.exports = router;
