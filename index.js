const dotenv = require("dotenv");
dotenv.config();

// Mongo DB Connection
require("./database");

// Server
const app = require("./server");

// Start Server
app.listen(app.get("port"), () => {
	console.log(`Server on port: ${app.get("port")}`);
});

const Request = require("./models/request");

const User = require("./models/user");

/* const main = async () => {
 *         const buyer = await User.findById("5e585c83718d0e44ae4b06c1");
 *         await buyer.populate("boss").execPopulate();
 *         console.log(buyer.boss);
 *         const user = await User.findById("5e586e6ceaa1d83a0272b470");
 *         await user.populate("buyers").execPopulate();
 *         console.log(user.buyers);
 * }; */

/* main(); */
