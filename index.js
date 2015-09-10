var tenso = require("tenso"),
	path = require("path"),
	config = require(path.join(__dirname, "config.json"));

if (config.email.enabled && config.email.host === "smtp.host") {
	console.error("Please configure the email settings");
	process.exit(0);
}

config.routes = require(path.join(__dirname, "routes.js"));
tenso(config);
