const fs = require("fs");
const argstostring = require("argstostring");
const subnpub = require("subnpub");

module.exports = id => {
  const { publish, subscribe, unsubscribe, reset } = subnpub();

  const out = (stream, args) => {
    const log = makeLog(id, args);
    stream.write(log);
    publish(log);

    return log;
  };

  return {
    readLogs,
    subscribe,
    unsubscribe,

    unsubscribeAll: reset,
    log: (...args) => out(process.stdout, args),
    error: (...args) => out(process.stderr, args)
  };
};

const makeLog = (id, args) =>
  new Date().toString() +
  ` :: ${id} :: ` +
  argstostring(...args).replace(/[\n\t]/g, " ") +
  "\n";

const readLogs = (path, cb = data => {}) => {
  let data = "";
  const readStream = fs.createReadStream(path, "utf8");
  readStream
    .on("data", chunk => (data += chunk))
    .on("end", () => cb(data))
    .on("error", err => process.stderr.write(err));
};
