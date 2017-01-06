"use strict";

const hippie = require("hippie"),
	path = require("path"),
	app = require(path.join(__dirname, "..", "index.js")),
	config = require(path.join(__dirname, "..", "config.json")),
	csrf = "x-csrf-token";

let token;

app.server.config.logging.enabled = false;

function persistCookies (opts, next) {
	opts.jar = true;
	next(opts);
}

function api () {
	return hippie().base("http://localhost:" + config.port).use(persistCookies).expectHeader("Content-Type", "application/json").json();
}

function get_token (fn, url) {
	return api().get(url || "/").end(fn);
}

describe("Public", function () {
	describe("GET / returns instructions", function () {
		it("returns a string", function (done) {
			api()
				.get("/")
				.expectStatus(200)
				.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
				.expectValue("links", [])
				.expectValue("data", config.instruction)
				.expectValue("error", null)
				.expectValue("status", 200)
				.end(function (err) {
					if (err) {
						throw err;
					}

					done();
				});
		});
	});

	describe("POST / csrf error", function () {
		it("returns an object with an error", function (done) {
			api()
				.post("/")
				.send()
				.expectStatus(403)
				.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
				.expectValue("data", null)
				.expectValue("error", "CSRF token missing")
				.expectValue("status", 403)
				.end(function (err) {
					if (err) {
						throw err;
					}

					done();
				});
		});
	});

	describe("POST / success", function () {
		it("returns an object with instructions", function (done) {
			get_token(function (err, res) {
				if (err) {
					throw err;
				}

				token = res.headers[csrf];
				api()
					.header(csrf, token)
					.post("/")
					.send()
					.json()
					.expectStatus(200)
					.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
					.expectValue("error", null)
					.expectValue("status", 200)
					.end(function () {
						done();
					});
			});
		});
	});

	describe("POST / success (min & max length)", function () {
		it("returns an object with instructions", function (done) {
			get_token(function (err, res) {
				const min = 10,
					max = 20;

				if (err) {
					throw err;
				}

				token = res.headers[csrf];
				api()
					.header(csrf, token)
					.post("/")
					.send({min: min, max: 20})
					.json()
					.expectStatus(200)
					.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
					.expectValue("error", null)
					.expectValue("status", 200)
					.expect(function (r, body, next) {
						next(body.data.length < min || body.data.length > max);
					})
					.end(function () {
						done();
					});
			});
		});
	});
});
