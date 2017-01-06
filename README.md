# cocoa

[![Join the chat at https://gitter.im/avoidwork/cocoa](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/avoidwork/cocoa?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Password generator service

![demo graphic](https://farm6.staticflickr.com/5346/16766074333_e7702728b6_o.png "cocoa demo")

[![build status](https://secure.travis-ci.org/avoidwork/cocoa.svg)](http://travis-ci.org/avoidwork/cocoa)

## What can cocoa do for me?
`cocoa` is a service which can generate 1 or many passwords using a mnemonic word list, and email you the result(s).
The password(s) is not logged, or saved anywhere.

## How do I run cocoa?
`cocoa` can be up and running in 3 steps! When run in a production environment, it's recommended that you use `NGINX`
to terminate SSL, and reverse proxy to `cocoa`. Using a daemon like `upstart` (on Linux) to run `cocoa` is ideal. 

1.  Clone [this](https://github.com/avoidwork/cocoa) repository, or install from `npm`:
    1.  `$ npm install cocoa`
    2.  `$ ln -s node_modules/cocoa/config.json config.json`
    3.  `$ ln -s node_modules/cocoa/index.js index.js`
2.  (Optional) Edit `config.json` to configure your email server, etc.
3.  Run via `node index.js`.

#### Upstart
Use the provided upstart recipe: `sudo sh -c 'cp node_modules/cocoa/cocoa.conf /etc/init; service cocoa start;'`

#### Systemd
Use the provided systemd service: `sudo sh -c 'cp node_modules/cocoa/cocoa.service /etc/systemd/system; systemctl enable cocoa; systemctl start cocoa;'`

#### What about Windows?
It runs great on Windows, but you're on your own to daemonize it!

## Request parameters
#### words
_Integer_ (3)
The amount of words to use

#### passwords
_Integer_ (1)
The amount of passwords to generate

#### special
_Boolean_ (false)
Randomly adds common "special" characters to a password, including capitalization

## Configuration
``` 
{
    "auth": /* Optional, see tenso authentication section */
    "compress": false, /* Optional, enabled by default, disabled with SSL */
    "email": { /* Optional, disabled by default */
        "enabled": true,
        "host": "smtp.host",
        "port": 465,
        "secure": true,
        "from": "You <you@yourdomain>",
        "user": "you@yourdomain",
        "pass": "password"
    },
    "headers": { ... }, /* Optional, custom headers */
    "hostname": "localhost", /* Optional, default is 'localhost' */
    "json": 2, /* Optional, default indent for 'pretty' JSON */
    "logs": { /* Optional */
        "level": "debug",
        "stdout": true,
        "dtrace": true,
        "stack": true
    },
    "port": 9090, /* Optional, default is 9090 */
    "rate": {
        "enabled": true,
        "limit": 450, /* Maximum requests allowed before `reset` */
        "reset": 900, /* TTL in seconds */
        "status": 429, /* Optional HTTP status */
        "message": "Too many requests",  /* Optional error message */
        "override": function ( req, rate ) { ... } /* Override the default rate limiting */
    },
    "session": { /* Optional */
        "secret": null,
        "store": "memory", /* "memory" or "redis" */
        "redis": /* See connect-redis for options */
    },
    "ssl": { /* Optional */
        "cert": null,
        "key": null
    },
    "title": "My API", /* Page title for browsable API */
    "uid": N /* Optional, system account uid to drop to after starting with elevated privileges to run on a low port */
}
```


## License
Copyright (c) 2017 Jason Mulligan
Licensed under the BSD-3 license.
