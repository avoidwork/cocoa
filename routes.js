var mpass = require( "mpass" ),
	util = require( "keigai" ).util,
	nodemailer = require( "nodemailer" ),
	path = require( "path" ),
	config = require( path.join(__dirname, "config.json" ) ),
	HEADERS = {"cache-control": "no-cache" },
	SUCCESS = 200,
	FAILURE = 500,
	PASSWORDS = 1,
	WORDS = 3,
	mta;

function email ( to, pass ) {
	var defer = util.defer();

	mta.sendMail( {
		from: config.email.from,
		to: to,
		subject: config.email.subject,
		text: config.email.text.replace( /\{\{password\}\}/g, pass ),
		html: config.email.html.replace( /\{\{password\}\}/g, pass )
	}, function ( e, info ) {
		if ( e ) {
			log( e, "error" );
			defer.reject( e );
		}
		else {
			defer.resolve( info.response );
		}
	} );

	return defer;
}

mta = nodemailer.createTransport( {
	host: config.email.host,
	port: config.email.port,
	secure: config.email.secure,
	auth: {
		user: config.email.user,
		pass: config.email.pass
	}
} );

module.exports.get = {
	"/": "POST to generate a password. Required parameter is `words` to specify `n` words to use, e.g. 3. Optional parameters are `email` to send as an Email, and `passwords` to generate a list of `n` passwords, e.g. 5."
};

module.exports.post = {
	"/": function ( req, res ) {
		var words = req.body.words || WORDS,
			nth = req.body.passwords || PASSWORDS,
			pass = [],
			i = -1,
			result;

		while ( ++i < nth ) {
			pass.push( mpass( words ) )
		}

		result = nth === 1 ? pass[0] : pass;

		if ( req.parsed.query.email ) {
			email( req.parsed.query.email, pass.join( "\n" ) ).then( function () {
				res.respond( result, SUCCESS, HEADERS );
			}, function ( e ) {
				res.respond( e.message || e.stack || e, FAILURE, HEADERS );
			} );
		} else {
			res.respond( result, SUCCESS, HEADERS );
		}
	}
};
