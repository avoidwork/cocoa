# gpasswd
Password generator service


## What can this do for me?
`gpasswd` is a service which can generate 1 or many passwords using a mnemonic word list, and email you the result(s).
The password(s) are not logged, or saved anywhere.

## How do I run this?
`gpasswd` can be up and running in 3 steps! When run in a production environment, it's recommended that you use `NGINX`
to terminate SSL, and reverse proxy to `gpasswd`. Using a daemon like `upstart` (on Linux) to run `gpasswd` is ideal. 

1.  Clone this repository
2.  Edit `config.json` to configure your email server (or change the port)
3.  Run via `node index.js`.

## Configuration
```json
{
    "auth": /* Optional, see tenso Authentication section */
    "compress": false, /* Optional, enabled by default, disabled with SSL */
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
