"use strict";

const tinyhttptest = require("tiny-httptest"),
	path = require("path"),
	app = require(path.join(__dirname, "..", "index.js")),
	config = require(path.join(__dirname, "..", "config.json")),
	csrf = "x-csrf-token",
	origin = "http://not.localhost";

app.config.logging.enabled = false;

describe("Public", function () {
	describe("GET / returns instructions", function () {
		it("returns an object with an instruction", function () {
			return tinyhttptest({url: "http://localhost:" + config.port})
				.cookies()
				.captureHeader(csrf)
				.expectStatus(200)
				.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
				.expectValue("links", [])
				.expectValue("data", config.instruction.create)
				.expectValue("error", null)
				.expectValue("status", 200)
				.end();
		});
	});

	describe("GET / returns instructions (CORS)", function () {
		it("returns an object with an instruction", function () {
			return tinyhttptest({url: "http://localhost:" + config.port, method: "options"})
				.cors(origin)
				.end()
				.then(() => tinyhttptest({url: "http://localhost:" + config.port})
					.cors(origin)
					.expectStatus(200)
					.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
					.expectValue("links", [])
					.expectValue("data", config.instruction.create)
					.expectValue("error", null)
					.expectValue("status", 200)
					.end());
		});
	});

	describe("POST / csrf error", function () {
		it("returns an object with an error", function () {
			return tinyhttptest({url: "http://localhost:" + config.port, method: "post"})
				.cookies()
				.expectStatus(403)
				.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
				.expectValue("data", null)
				.expectValue("error", "CSRF token missing")
				.expectValue("status", 403)
				.end();
		});
	});

	describe("POST / success", function () {
		it("returns an object with a password", function () {
			return tinyhttptest({url: "http://localhost:" + config.port, method: "post"})
				.cookies()
				.reuseHeader(csrf)
				.expectStatus(200)
				.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
				.expectValue("error", null)
				.expectValue("status", 200)
				.end();
		});
	});

	describe("POST / success (min & max)", function () {
		it("returns an object with a password", function () {
			const min = 10,
				max = 20;

			return tinyhttptest({url: "http://localhost:" + config.port, method: "post"})
				.cookies()
				.reuseHeader(csrf)
				.json({min: min, max: max})
				.expectStatus(200)
				.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
				.expectValue("error", null)
				.expectValue("status", 200)
				.expectBody(function (arg) {
					return arg.data.length >= min && arg.data.length <= max;
				})
				.end();
		});
	});

	describe("POST / failure (invalid min & max)", function () {
		it("returns an object with an error", function () {
			const min = 1,
				max = 2;

			return tinyhttptest({url: "http://localhost:" + config.port, method: "post"})
				.cookies()
				.reuseHeader(csrf)
				.json({min: min, max: max})
				.expectStatus(400)
				.expectHeader("allow", "GET, HEAD, OPTIONS, POST")
				.expectValue("data", null)
				.expectValue("error", config.instruction.error)
				.expectValue("status", 400)
				.end();
		});
	});
});
