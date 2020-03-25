//Libraries

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
