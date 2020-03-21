const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
	name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	type: { type: String, required: true },
	status: { type: Boolean, required: true, default: true },
	tier:{type: String, default: ""},
	boss: { type: Schema.Types.ObjectId, ref: "User" }
});


const User = mongoose.model("User", UserSchema);
module.exports = User;
