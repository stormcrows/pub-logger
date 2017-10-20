const Logger = require("./index");

const stdout = process.stdout.write;
const stderr = process.stderr.write;
let logger = null;

beforeEach(() => {
  logger = Logger("_test_");
  process.stdout.write = jest.fn();
  process.stderr.write = jest.fn();
});

describe("log/error", () => {
  it("should write to stdout & stderr respectively", () => {
    logger.log("TEST!");
    logger.error("ERROR!");

    expect(process.stdout.write).toHaveBeenCalled();
    expect(process.stderr.write).toHaveBeenCalled();
  });

  it("should call provided subscriber with correctly formatted log string", () => {
    let out = null;
    const fn = jest.fn(str => (out = str));
    logger.subscribe(fn);
    
    logger.log("TEST!");
    expect(out.split(" :: ")[2]).toBe("TEST!\n");
    
    logger.error("ERROR!");
    expect(out.split(" :: ")[2]).toBe("ERROR!\n");
  });

  it("should not call provided subscriber if unsubscribed", () => {
    const fn = jest.fn();
    
    logger.subscribe(fn);
    logger.unsubscribe(fn);
    
    logger.log("TEST!");
    logger.error("ERROR!");

    expect(fn).not.toHaveBeenCalled();
  });
});

describe("readLogs", () => {
  it("should read the test.log file", done => {
    function cb(data) {
      expect(data).toBe("EUREKA!\nMY DEAR WATSON!");
      done();
    }

    logger.readLogs("./test.log", cb);
  });

  it("should throw an error if no path provided", () => {
    expect(() => logger.readLogs()).toThrow();
  });
});

afterEach(() => {
  process.stdout = stdout;
  process.stderr = stderr;
});
