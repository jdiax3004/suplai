const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Load User Model

const User = require("./models/user");
module.exports = function(passport) {
	//User Auth
	passport.use(
		new LocalStrategy(
			{ usernameField: "email" },
			(email, password, done) => {
				//Match User
				User.findOne({ email: email })
					.then(user => {
						if (!user) {
							return done(
								null,
								false,
								{
									message:
										"That email does not exist"
								}
							);
						}
						//Match Password
						bcrypt.compare(
							password,
							user.password,
							(err, isMatch) => {
								if (err)
									throw err;
								if (isMatch) {
									return done(
										null,
										user
									);
								} else {
									return done(
										null,
										false,
										{
											message:
												"Password Incorrect"
										}
									);
								}
							}
						);
					})
					.catch(err => console.log(err));
			}
		)
	);
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
