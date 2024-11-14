export type Logs = string[];

/** Options for creating a logger */
export interface LoggerOptions {
  /** Print messages to console or not */
  silent?: boolean;
}

/** Creates Logger interface */
export interface LoggerConstructor {
  /** Returns Logger interface
   * @param options - Options for creating a logger {@link LoggerOptions}.
   * @returns Logger instance {@link LoggerInstance}.
   * @example const childProcessManager = new ChildProcessManager(["echo", '"Hello world!"'], { silent: true });
   */
  new (options: LoggerOptions): LoggerInterface;
}

export interface LoggerInterface {
  /** Add a message to the logs array, and print it in case silent option is not enabled */
  log(message: string): void;

  /** Returns the logs array */
  get logs(): Logs;
}
