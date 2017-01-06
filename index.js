const tenso = require("tenso"),
	path = require("path"),
	config = require(path.join(__dirname, "config.json"));

let app;

if (config.email.enabled && config.email.host === "smtp.host") {
	console.error("Please configure the email settings");
	process.exit(0);
}

config.routes = require(path.join(__dirname, "routes.js"));
app = tenso(config);

module.exports = app;
