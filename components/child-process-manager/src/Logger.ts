// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type {
  LoggerInterface,
  LoggerOptions,
  LoggerConstructor,
  Logs,
} from "./Logger.types";

/**
 * Log to console
 * @param args - Arguments to log
 */
export function log(...args: unknown[]) {
  // eslint-disable-next-line no-console
  return console.log(...args);
}

/** Logger class */
export const Logger: LoggerConstructor = class Logger
  implements LoggerInterface
{
  private _silent: boolean;
  private _logs: string[];

  /**
   * Creates a new instance of Logger
   * @param options Options to customize the logger {@link LoggerOptions}
   */
  constructor(options: LoggerOptions) {
    this._silent = options.silent || false;
    this._logs = [];

    this.log = this.log.bind(this);
  }

  /**
   * Returns the logs array
   */
  public get logs(): Logs {
    return this._logs;
  }

  /**
   * Add a message to the logs array, and print it in case silent option is not enabled
   * In case the message has multiple lines, it will be split and each line will be added to the logs array separately
   * @param message - Message to log
   */
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
