const mpass = require("mpass"),
	deferred = require("tiny-defer"),
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
	MIN_LENGTH = 0,
	MAX_LENGTH = 100,
	SPECIAL = false;

let mta;

function email (to, pass) {
	let defer = deferred();

	mta.sendMail({
		from: config.email.from,
		to: to,
		subject: config.email.subject,
		text: config.email.text.replace(/\{\{password\}\}/g, pass),
		html: config.email.html.replace(/\{\{password\}\}/g, pass.replace(/\n/g, "<br />"))
	}, (e, info) => {
		if (e) {
			defer.reject(e);
		} else {
			defer.resolve(info.response);
		}
	});

	return defer.promise;
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

module.exports = {
	get: {
		"/": config.instruction
	},
	post: {
		"/": (req, res) => {
			let words = req.body.words === undefined ? WORDS : req.body.words,
				nth = req.body.passwords === undefined ? PASSWORDS : req.body.passwords,
				special = req.body.special === undefined ? SPECIAL : req.body.special,
				min = req.body.min === undefined ? MIN_LENGTH : req.body.min,
				max = req.body.max === undefined ? MAX_LENGTH : req.body.max,
				pass = [],
				i = -1,
				result, tmp;

			if (typeof words !== "number" || words < 1 || typeof nth !== "number" || nth < 1) {
				res.error(INVALID, new Error("Invalid arguments"));
			} else {
				words = words > WORDS_MAX ? WORDS_MAX : words;
				nth = nth > PASSWORDS_MAX ? PASSWORDS_MAX : nth;
				special = special === true;

				if (min > 0) {
					while (++i < nth) {
						tmp = "";

						while (tmp.length < min && tmp.length < max) {
							tmp = mpass(words, special);
						}

						pass.push(tmp);
					}
				} else {
					while (++i < nth) {
						pass.push(mpass(words, special));
					}
				}

				result = nth === 1 ? pass[0] : pass;

				if (config.email.enabled && req.body.email) {
					email(req.body.email, pass.join("\n")).then(() => {
						res.send(result, SUCCESS, HEADERS);
					}, e => {
						res.error(FAILURE, e);
						console.error(e.stack || e.message || e);
					});
				} else {
					res.send(result, SUCCESS, HEADERS);
				}
			}
		}
	}
};
