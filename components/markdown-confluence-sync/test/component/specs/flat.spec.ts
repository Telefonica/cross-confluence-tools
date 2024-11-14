import type { ChildProcessManagerInterface } from "@telefonica-cross/child-process-manager";
import { ChildProcessManager } from "@telefonica-cross/child-process-manager";

import { cleanLogs } from "../support/Logs";
import {
  changeMockCollection,
  getRequestsByRouteId,
  resetRequests,
} from "../support/Mock";
import type { SpyRequest } from "../support/Mock.types";
import {
  getBinaryPathFromFixtureFolder,
  getFixtureFolder,
} from "../support/Paths";

describe("markdown-confluence-sync binary", () => {
  let cli: ChildProcessManagerInterface;
  let logs: string[];
  let exitCode: number | null;
  let createRequests: SpyRequest[];

  describe("with flat mode active", () => {
    describe("when no file pattern is provided", () => {
      beforeAll(async () => {
        await changeMockCollection("with-mdx-files");
        await resetRequests();

        cli = new ChildProcessManager(
          [getBinaryPathFromFixtureFolder(), "--mode=flat"],
          {
            cwd: getFixtureFolder("mock-server-with-mdx-files"),
            silent: true,
            env: {
              MARKDOWN_CONFLUENCE_SYNC_LOG_LEVEL: "debug",
            },
          },
        );

        const result = await cli.run();
        logs = result.logs;
        exitCode = result.exitCode;
      });

      afterAll(async () => {
        await cli.kill();
      });

      it("should have exit code 1", async () => {
        expect(exitCode).toBe(1);
      });

      it("should fail and throw error because file pattern can't be empty", async () => {
        expect(cleanLogs(logs)).toEqual(
          expect.arrayContaining([
            expect.stringContaining(`File pattern can't be empty in flat mode`),
          ]),
        );
      });
    });

    describe("when filesPattern option found more than one page", () => {
      beforeAll(async () => {
        await changeMockCollection("with-confluence-page-id");
        await resetRequests();

        cli = new ChildProcessManager(
          [getBinaryPathFromFixtureFolder(), "--filesPattern=**/grandChild1*"],
          {
            cwd: getFixtureFolder("mock-server-with-confluence-page-id"),
            silent: true,
            env: {
              MARKDOWN_CONFLUENCE_SYNC_LOG_LEVEL: "debug",
              MARKDOWN_CONFLUENCE_SYNC_MODE: "flat",
              MARKDOWN_CONFLUENCE_SYNC_CONFLUENCE_ROOT_PAGE_ID: "foo-root-id",
            },
          },
        );

        const result = await cli.run();
        logs = result.logs;
        exitCode = result.exitCode;

        createRequests = await getRequestsByRouteId("confluence-create-page");
      });

      afterAll(async () => {
        await cli.kill();
      });

      it("should have exit code 0", async () => {
        expect(exitCode).toBe(0);
      });

      it("should display a log text containing 'matching the pattern", async () => {
        expect(cleanLogs(logs)).toEqual(
          expect.arrayContaining([
            expect.stringContaining(`matching the pattern`),
          ]),
        );
      });

      it("you should have created 3 pages that have ancestors with the root page id", async () => {
        const ancestors = [{ id: "foo-root-id" }];

        expect(createRequests).toHaveLength(3);
        expect(createRequests.at(0)?.body?.ancestors).toStrictEqual(ancestors);
        expect(createRequests.at(1)?.body?.ancestors).toStrictEqual(ancestors);
        expect(createRequests.at(2)?.body?.ancestors).toStrictEqual(ancestors);
      });
    });

    describe("when the options have the option filesPattern and no rootPageId", () => {
      let updateRequest: SpyRequest[];

      beforeAll(async () => {
        await changeMockCollection("with-confluence-page-id");
        await resetRequests();

        cli = new ChildProcessManager(
          [getBinaryPathFromFixtureFolder(), "--filesPattern=**/grandChild2*"],
          {
            cwd: getFixtureFolder("mock-server-with-confluence-page-id"),
            silent: true,
            env: {
              MARKDOWN_CONFLUENCE_SYNC_LOG_LEVEL: "debug",
              MARKDOWN_CONFLUENCE_SYNC_MODE: "flat",
            },
          },
        );

        const result = await cli.run();
        logs = result.logs;
        exitCode = result.exitCode;
        updateRequest = await getRequestsByRouteId("confluence-update-page");
      });

      afterAll(async () => {
        await cli.kill();
      });

      it("should have exit code 0", async () => {
        expect(exitCode).toBe(0);
      });

      it("should have updated 1 page with the confluence page identifier given in the file", async () => {
        expect(updateRequest).toHaveLength(1);
      });
    });

    describe("when filesPattern option searches for a txt file", () => {
      beforeAll(async () => {
        await changeMockCollection("with-confluence-page-id");
        await resetRequests();

        cli = new ChildProcessManager(
          [
            getBinaryPathFromFixtureFolder(),
            "--filesPattern=**/grandChild1.txt",
          ],
          {
            cwd: getFixtureFolder("mock-server-with-confluence-page-id"),
            silent: true,
            env: {
              MARKDOWN_CONFLUENCE_SYNC_LOG_LEVEL: "debug",
              MARKDOWN_CONFLUENCE_SYNC_MODE: "flat",
            },
          },
        );

        const result = await cli.run();
        logs = result.logs;
        exitCode = result.exitCode;

        createRequests = await getRequestsByRouteId("confluence-create-page");
      });

      afterAll(async () => {
        await cli.kill();
      });

      it("should have exit code 0", async () => {
        expect(exitCode).toBe(0);
      });

      it("should not have created pages because the file filter is looking for md or mdx files", async () => {
        expect(createRequests).toHaveLength(0);
      });
    });

    describe("when filesPattern option searches files with 'check' pattern", () => {
      beforeAll(async () => {
        await changeMockCollection("with-confluence-page-id");
        await resetRequests();

        cli = new ChildProcessManager(
          [getBinaryPathFromFixtureFolder(), "--filesPattern=**/check*"],
          {
            cwd: getFixtureFolder("mock-server-with-confluence-page-id"),
            silent: true,
            env: {
              MARKDOWN_CONFLUENCE_SYNC_LOG_LEVEL: "debug",
              MARKDOWN_CONFLUENCE_SYNC_MODE: "flat",
            },
          },
        );

        const result = await cli.run();
        logs = result.logs;
        exitCode = result.exitCode;

        createRequests = await getRequestsByRouteId("confluence-create-page");
      });

      afterAll(async () => {
        await cli.kill();
      });

      it("should have exit code 0", async () => {
        expect(exitCode).toBe(0);
      });

      it("should not have created pages because files not matches pattern", async () => {
        expect(createRequests).toHaveLength(0);
      });
    });

    describe("when no rootPageId is provided and there are pages without confluence id", () => {
      beforeAll(async () => {
        await changeMockCollection("with-confluence-page-id");
        await resetRequests();

        cli = new ChildProcessManager(
          [getBinaryPathFromFixtureFolder(), "--filesPattern=**/grandChild1*"],
          {
            cwd: getFixtureFolder("mock-server-with-confluence-page-id"),
            silent: true,
            env: {
              MARKDOWN_CONFLUENCE_SYNC_LOG_LEVEL: "debug",
              MARKDOWN_CONFLUENCE_SYNC_MODE: "flat",
            },
          },
        );

        const result = await cli.run();
        logs = result.logs;
        exitCode = result.exitCode;

        createRequests = await getRequestsByRouteId("confluence-create-page");
      });

      afterAll(async () => {
        await cli.kill();
      });

      it("should have exit code 1", async () => {
        expect(exitCode).toBe(1);
      });

      it("should display a log text containing 'when there are pages without an id' because all pages haven't confluence pages ids", async () => {
        expect(cleanLogs(logs)).toEqual(
          expect.arrayContaining([
            expect.stringContaining(`when there are pages without an id`),
          ]),
        );
      });
    });
  });
});
