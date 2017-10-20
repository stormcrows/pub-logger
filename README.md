# pub-logger
[![CircleCI](https://circleci.com/gh/stormcrows/pub-logger/tree/master.svg?style=svg)](https://circleci.com/gh/stormcrows/pub-logger/tree/master)

Micro logger with publish/subscribe mechanism.

What it can do:
  - log(...args) parses arguments to string and sends them to process.stdout,
  - error(...args) parses arguments to string and sends them to process.stderr,
  - log/error messages are published to subscribed functions,
  - it can asynchronously read a file and run a callback with the contents,
  - stdout/stderr can be sent to files; ex.: node app.js 2>&1 | tee mylogs.log.

Pub/Sub is useful if you require objects in your application to consume the log.
For example: if you'd like to send new logs in realtime to an admin dashboard 
over web sockets, avoiding costly file operations.

## USAGE

```javascript
const Logger = require("pub-logger")("_log_");

// I. log & subscribe & unsubscribe
const sub1 = log => { console.log("SUB-1:", log); }
const sub2 = log => { console.log("SUB-2:", log); }
logger.subscribe([sub1, sub2]);
logger.log("logging..."); // goes to stdout
//-> SUB-1: Sat Oct 14 2017 23:04:57 GMT+0100 (BST) :: _log_ :: logging...
//-> SUB-2: Sat Oct 14 2017 23:04:57 GMT+0100 (BST) :: _log_ :: logging...
logger.unsubscribe([sub1, sub2]); // also: unsubscribe(sub1, sub2);


// II. error & subscribe & unsubscribeAll
const sub3 = log => { console.log("SUB-3:", log); }
const sub4 = log => { console.log("SUB-4:", log); }
logger.subscribe([sub3, sub4]);
logger.error("errors!!!"); // goes to stderr
//-> SUB-3: Sat Oct 14 2017 23:04:57 GMT+0100 (BST) :: _log_ :: errors!!!
//-> SUB-4: Sat Oct 14 2017 23:04:57 GMT+0100 (BST) :: _log_ :: errors!!!
logger.unsubscribeAll();

// III. readLogs
const cb = log => { console.log("log from file: ", log); }
// throws Error if there is a problem with of the file; IO errors go to stderr
logger.readLogs("logs/mylog", cb); // async
//-> log from file: ....
```
