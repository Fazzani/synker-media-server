const chalk = require("chalk");

export enum LOG_TYPES {
  NONE = 0,
  ERROR = 1,
  NORMAL = 2,
  DEBUG = 3,
  FFDEBUG = 4
}

export class Logger {
  static logType: LOG_TYPES = LOG_TYPES.NORMAL;

  public static setLogType = (type: LOG_TYPES) => {
    if (typeof type !== "number") return;

    Logger.logType = type;
  };

  public static logTime = () => {
    let nowDate = new Date();
    return nowDate.toLocaleDateString() + " " + nowDate.toLocaleTimeString([], { hour12: false });
  };

  public static log = (...args: any[]) => {
    if (Logger.logType < LOG_TYPES.NORMAL) return;

    console.log(Logger.logTime(), process.pid, chalk.bold.green("[INFO]"), ...args);
  };

  public static error = (...args: any[]) => {
    if (Logger.logType < LOG_TYPES.ERROR) return;

    console.log(Logger.logTime(), process.pid, chalk.bold.red("[ERROR]"), ...args);
  };

  public static debug = (...args: any[]) => {
    if (Logger.logType < LOG_TYPES.DEBUG) return;

    console.log(Logger.logTime(), process.pid, chalk.bold.blue("[DEBUG]"), ...args);
  };

  public static ffdebug = (...args: any[]) => {
    if (Logger.logType < LOG_TYPES.FFDEBUG) return;

    console.log(Logger.logTime(), process.pid, chalk.bold.blue("[FFDEBUG]"), ...args);
  };
}

