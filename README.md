# cocoa
Password generator service


## What can cocoa do for me?
`cocoa` is a service which can generate 1 or many passwords using a mnemonic word list, and email you the result(s).
The password(s) is not logged, or saved anywhere.

## How do I run cocoa?
`cocoa` can be up and running in 3 steps! When run in a production environment, it's recommended that you use `NGINX`
to terminate SSL, and reverse proxy to `cocoa`. Using a daemon like `upstart` (on Linux) to run `cocoa` is ideal. 

1.  Clone [this](https://github.com/avoidwork/cocoa) repository, or install from `npm`
    1.  `$ npm install cocoa`
    2.  `$ ln -s node_modules/cocoa/config.json config.json`
    3.  `$ ln -s node_modules/cocoa/index.js index.js`
2.  Edit `config.json` to configure your email server (or change the port)
3.  Run via `node index.js`.

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
Copyright (c) 2015 Jason Mulligan  
Licensed under the BSD-3 license.