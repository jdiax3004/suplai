const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequestSchema = new Schema({
	title: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	budget: { type: Number, required: true },
	status: { type: String, required: true },
	dateCreated: { type: Date, required: true, default: Date.now() },
	owner: {
		type: mongoose.Schema.Types.ObjectId, //_id of Buyer
		required: true,
		ref: "User" //User
	},
	boss_owner:{
		type:mongoose.Schema.Types.ObjectId, //_id of Boss
		required:true,
		ref:"User"
	},
	financer_owner:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	}
});

module.exports = mongoose.model("Request", RequestSchema);
