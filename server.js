//Libraries
const express = require("express");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

//Passport config
require("./passport")(passport);

// Server Settings
app.set("port", process.env.PORT || 3000);
app.set("view engine", "html");

// Middlewares
app.use(
	cors({
		origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
		credentials: true
	})
);
//BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// BodyParser
app.use(express.urlencoded({ extended: false }));

//Express Session Middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		cookie: {
			maxAge: 7200000,
			httpOnly: false,
			secure: false
		}
	})
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Cookie Parser
app.use(cookieParser());
// Routes
app.use(process.env.API_BASE_PATH, require("./routes/user.route"));
app.use(process.env.API_BASE_PATH, require("./routes/requisition.route"));

// Default Route
app.use("*", (req, res, next) => {
	if (!req.originalUrl.includes(process.env.API_BASE_PATH))
		res.sendFile(path.join(__dirname, "public", "index.html"));
	else next();
});

module.exports = app;
