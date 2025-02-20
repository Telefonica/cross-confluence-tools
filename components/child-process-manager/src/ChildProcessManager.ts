// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import crossSpawn from "cross-spawn";
import treeKill from "tree-kill";
import { Readable } from "stream";

import { Logger, log } from "./Logger";
import type { LoggerInterface } from "./Logger.types";
import type {
  ChildProcessManagerInterface,
  ChildProcessManagerConstructor,
  ChildProcessManagerOptions,
  ChildProcessManagerExitCode,
  ChildProcessManagerResult,
} from "./types";
import { SpawnOptions } from "child_process";

const ENCODING_TYPE = "utf8";

/**
 * Class to manage child processes
 */
export const ChildProcessManager: ChildProcessManagerConstructor = class ChildProcessManager
  implements ChildProcessManagerInterface
{
  private _logger: LoggerInterface;
  private _command: { name: string; params: string[] };
  private _silent: boolean;
  private _cwd: string;
  private _env?: Record<string, string>;
  private _exitPromise: Promise<ChildProcessManagerResult>;
  private _resolveExitPromise: () => void;
  private _cliProcess: ReturnType<typeof crossSpawn> | null;
  private _exitCode: ChildProcessManagerExitCode;
  private _crossSpawnOptions: SpawnOptions;

  /**
   * Creates a new instance of ChildProcessManager
   * @param commandAndArguments Array with the command and arguments
   * @param options Options to customize the process {@link ChildProcessManagerOptions}
   * @param crossSpawnOptions Options to be passed to cross-spawn {@link SpawnOptions}
   */
  constructor(
    commandAndArguments: string[],
    options: ChildProcessManagerOptions = {},
    crossSpawnOptions?: SpawnOptions,
  ) {
    this._command = this._getCommandToExecute(commandAndArguments);
    this._silent = options.silent || false;
    this._cwd = options.cwd || process.cwd();
    this._crossSpawnOptions = crossSpawnOptions || {};
    this._env = options.env;
    this._logger = new Logger({ silent: this._silent });
    this._cliProcess = null;
  }

  /**
   * Returns the process exit promise
   */
  public get exitPromise() {
    return this._exitPromise;
  }

  /**
   * Returns the process exit code
   */
  public get exitCode() {
    return this._exitCode;
  }

  /**
   * Returns the process logs
   */
  public get logs() {
    return this._logger.logs;
  }

  /**
   * Runs the process and returns a promise that resolves when the process is finished
   * @returns Promise that resolves when the process is finished
   */
  public async run(): Promise<ChildProcessManagerResult> {
    this._exitPromise = new Promise((resolve) => {
      this._resolveExitPromise = () => {
        resolve({
          exitCode: this._exitCode,
          logs: this._logger.logs,
        });
      };
    });

    try {
      this._cliProcess = crossSpawn(this._command.name, this._command.params, {
        cwd: this._cwd,
        env: {
          ...process.env,
          ...this._env,
        },
        ...this._crossSpawnOptions,
      });

      const stdout = this._cliProcess.stdout as Readable;
      const stderr = this._cliProcess.stderr as Readable;

      stdout.setEncoding(ENCODING_TYPE);
      stderr.setEncoding(ENCODING_TYPE);

      stdout.on("data", this._logger.log);
      stderr.on("data", this._logger.log);

      this._cliProcess.on("error", (error) => {
        this._logger.log(error.message);
        log(error);
      });
      this._cliProcess.on("close", (code) => {
        this._exitCode = code;
        this._resolveExitPromise();
      });
    } catch (error) {
      log("Error starting process");
      log(error);
      this._exitCode = 1;
      this._resolveExitPromise();
    }
    return this._exitPromise;
  }

  /**
   * Kills the process and returns a promise that resolves when the process is killed
   * @returns Promise that resolves when the process is killed
   */
  public async kill(): Promise<ChildProcessManagerResult> {
    if (this._cliProcess?.pid) {
      treeKill(this._cliProcess.pid);
      return this._exitPromise;
    }
    return {
      exitCode: null,
      logs: [],
    };
  }

  /**
   * Returns the command to execute
   * @param commandAndArguments Array with the command and arguments
   * @returns Object with the command and arguments
   */
  private _getCommandToExecute(commandAndArguments: string[]): {
    name: string;
    params: string[];
  } {
    return {
      name: commandAndArguments[0],
      params: commandAndArguments.splice(1, commandAndArguments.length - 1),
    };
  }
};
