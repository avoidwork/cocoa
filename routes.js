var mpass = require("mpass"),
	util = require("keigai").util,
	nodemailer = require("nodemailer"),
	path = require("path"),
	config = require(path.join(__dirname, "config.json")),
	HEADERS = {"cache-control": "no-cache"},
	SUCCESS = 200,
	INVALID = 400,
	FAILURE = 500,
	PASSWORDS = 1,
	PASSWORDS_MAX = config.max || 100,
	WORDS = 3,
	WORDS_MAX = 10,
	SPECIAL = false,
	mta;

function email (to, pass) {
	var defer = util.defer();

	mta.sendMail({
		from: config.email.from,
		to: to,
		subject: config.email.subject,
		text: config.email.text.replace(/\{\{password\}\}/g, pass),
		html: config.email.html.replace(/\{\{password\}\}/g, pass.replace(/\n/g, "<br />"))
	}, function (e, info) {
		if (e) {
			defer.reject(e);
		} else {
			defer.resolve(info.response);
		}
	});

	return defer;
}

mta = nodemailer.createTransport({
	host: config.email.host,
	port: config.email.port,
	secure: config.email.secure,
	auth: {
		user: config.email.user,
		pass: config.email.pass
	}
});

module.exports.get = {
	"/": "POST to generate a password. Optional parameters `words` (3) to specify amount to use, `email` to send as an Email, `passwords` (1) to generate a list, & `special` (false) to enable common special characters."
};

module.exports.post = {
	"/": function (req, res) {
		var words = req.body.words === undefined ? WORDS : req.body.words,
			nth = req.body.passwords === undefined ? PASSWORDS : req.body.passwords,
			special = req.body.special === undefined ? SPECIAL : req.body.special,
			pass = [],
			i = -1,
			result;

		if (typeof words !== "number" || words < 1 || typeof nth !== "number" || nth < 1) {
			res.error(INVALID, new Error("Invalid arguments"));
		} else {
			words = words > WORDS_MAX ? WORDS_MAX : words;
			nth = nth > PASSWORDS_MAX ? PASSWORDS_MAX : nth;
			special = special === true;

			while (++i < nth) {
				pass.push(mpass(words, special));
			}

			result = nth === 1 ? pass[0] : pass;

			if (config.email.enabled && req.body.email) {
				email(req.body.email, pass.join("\n")).then(function () {
					res.respond(result, SUCCESS, HEADERS);
				}, function (e) {
					res.error(FAILURE, e);
					console.error(e.stack || e.message || e);
				});
			} else {
				res.respond(result, SUCCESS, HEADERS);
			}
		}
	}
};
