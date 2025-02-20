// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { Logs } from "./Logger.types";

/** Options for creating a child process manager */
export interface ChildProcessManagerOptions {
  /** Print process stdout while the process or running or not. Logs will be stored anyway */
  silent?: boolean;

  /** Path where to execute the process */
  cwd?: string;

  /** Environment variables to be used in the process */
  env?: Record<string, string>;
}

export type ChildProcessManagerExitCode = number | null;

/** Result of the child process promise */
export interface ChildProcessManagerResult {
  /** Process exit code */
  exitCode: ChildProcessManagerExitCode;
  /** Process logs */
  logs: Logs;
}

/** Creates ChildProcessManager interface */
export interface ChildProcessManagerConstructor {
  /** Returns ChildProcessManager interface
   * @param commandAndArguments - Terminal command and arguments, each one in one different item into the array
   * @param options - Options for creating a child process manager {@link ChildProcessManagerOptions}.
   * @returns Child process manager instance {@link ChildProcessManagerInterface}.
   * @example const childProcessManager = new ChildProcessManager(["echo", '"Hello world!"'], { silent: true });
   */
  new (
    commandAndArguments: string[],
    options?: ChildProcessManagerOptions,
  ): ChildProcessManagerInterface;
}

export interface ChildProcessManagerInterface {
  /** Kills the process and returns a promise that resolves when the process is killed */
  kill(): Promise<ChildProcessManagerResult>;

  /** Runs the process and returns a promise that resolves when the process is finished */
  run(): Promise<ChildProcessManagerResult>;

  /** Returns the process exit promise. It may be useful in case you want to start the process, do some things, and wait for the process to finish afterwards */
  get exitPromise(): Promise<ChildProcessManagerResult>;

  /** Returns the process exit code */
  get exitCode(): ChildProcessManagerExitCode;

  /** Returns the process logs */
  get logs(): Logs;
}
