import type {
  LoggerInterface,
  LoggerOptions,
  LoggerConstructor,
  Logs,
} from "./Logger.types";

export function log(...args: unknown[]) {
  // eslint-disable-next-line no-console
  return console.log(...args);
}

export const Logger: LoggerConstructor = class Logger
  implements LoggerInterface
{
  private _silent: boolean;
  private _logs: string[];

  constructor(options: LoggerOptions) {
    this._silent = options.silent || false;
    this._logs = [];

    this.log = this.log.bind(this);
  }

  public get logs(): Logs {
    return this._logs;
  }

  public log(message: string): void {
    const cleanMessage = message.trim();
    const messages = cleanMessage.split(/[\r\n]|[\n]/gim);
    if (messages.length > 1) {
      messages.forEach((lineMessage) => this.log(lineMessage));
      return;
    }
    const messageToLog = messages[0];
    if (messageToLog.length) {
      this._logs.push(messageToLog);
      if (!this._silent) {
        log(messageToLog);
      }
    }
  }
};
