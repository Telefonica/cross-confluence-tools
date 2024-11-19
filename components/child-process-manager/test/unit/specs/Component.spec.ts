// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { ChildProcessManager } from "@src/index";

describe("childProcessManager", () => {
  describe("run method", () => {
    it("should run the process and return exit code and logs", async () => {
      const childProcessManager = new ChildProcessManager(
        ["echo", "Hello world!"],
        {
          silent: true,
        },
      );
      const { logs, exitCode } = await childProcessManager.run();

      // eslint-disable-next-line
      expect(logs).toEqual(["Hello world!"])
      expect(exitCode).toBe(0);
    });

    it("should print logs if silent option is not provided", async () => {
      jest.spyOn(console, "log").mockImplementation(() => {
        // do nothing
      });
      const childProcessManager = new ChildProcessManager([
        "echo",
        "Hello world!",
      ]);
      await childProcessManager.run();

      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalledWith("Hello world!");
    });

    it("should return exit code 1 when there is an error starting the process", async () => {
      // @ts-expect-error Force error passing a number as command
      const childProcessManager = new ChildProcessManager([2], {
        silent: true,
        cwd: "foo",
      });
      const { exitCode } = await childProcessManager.run();

      expect(exitCode).toBe(1);
    });
  });

  describe("exitCode getter", () => {
    it("should return 0 when process finish ok", async () => {
      const childProcessManager = new ChildProcessManager(
        ["echo", "Hello world!"],
        {
          silent: true,
        },
      );
      await childProcessManager.run();

      expect(childProcessManager.exitCode).toBe(0);
    });

    it("should return code error when process fails", async () => {
      const childProcessManager = new ChildProcessManager(["foo-command"], {
        silent: false,
      });
      await childProcessManager.run();

      expect(childProcessManager.exitCode).toBe(-2);
    });

    it("should return null when process is killed", async () => {
      const childProcessManager = new ChildProcessManager(["sleep", "10"], {
        silent: true,
      });
      childProcessManager.run();

      await childProcessManager.kill();

      expect(childProcessManager.exitCode).toBeNull();
    });
  });

  describe("logs getter", () => {
    it("should return logs when process finish ok", async () => {
      const childProcessManager = new ChildProcessManager(
        ["echo", "Hello world!"],
        {
          silent: true,
        },
      );
      await childProcessManager.run();

      expect(childProcessManager.logs).toEqual(["Hello world!"]);
    });

    it("logs should include error message when process fails", async () => {
      const childProcessManager = new ChildProcessManager(["foo-command"], {
        silent: false,
      });
      await childProcessManager.run();

      expect(childProcessManager.logs).toEqual(["spawn foo-command ENOENT"]);
    });

    it("logs should be separated for each different line", async () => {
      const childProcessManager = new ChildProcessManager(
        ["echo", "Foo\nVar\nBaz\n"],
        {
          silent: false,
        },
      );
      await childProcessManager.run();

      expect(childProcessManager.logs).toEqual(["Foo", "Var", "Baz"]);
    });

    it("logs should ignore empty log lines and spaces before or after the content in each line", async () => {
      const childProcessManager = new ChildProcessManager(
        ["echo", "Foo\n  Var \n    \nBaz  \n"],
        {
          silent: false,
        },
      );
      await childProcessManager.run();

      expect(childProcessManager.logs).toEqual(["Foo", "Var", "Baz"]);
    });
  });

  describe("exitPromise getter", () => {
    it("should return a promise resolved when process finish", async () => {
      const childProcessManager = new ChildProcessManager(["sleep", "1"], {
        silent: true,
      });
      childProcessManager.run();

      await childProcessManager.exitPromise;

      expect(childProcessManager.exitCode).toBe(0);
    });
  });

  describe("kill method", () => {
    it("should kill the child process", async () => {
      const beforeStart = Date.now();
      const childProcessManager = new ChildProcessManager(["sleep", "10"], {
        silent: true,
      });
      childProcessManager.run();

      await childProcessManager.kill();
      const afterStop = Date.now();

      expect(afterStop - beforeStart).toBeLessThan(2000);
    });

    it("should do nothing when the process is not running", async () => {
      const childProcessManager = new ChildProcessManager(
        ["echo", "Hello world!"],
        {
          silent: true,
        },
      );

      const { logs, exitCode } = await childProcessManager.kill();

      expect(logs).toEqual([]);
      expect(exitCode).toBeNull();
    });
  });
});
