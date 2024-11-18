// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { writeFileSync } from "fs";
import { join } from "node:path";

import type { LogMessage } from "@mocks-server/logger";
import { Logger } from "@mocks-server/logger";
import type { DirResult } from "tmp";
import { dedent } from "ts-dedent";

import { TempFiles } from "@support/utils/TempFiles";
const { dirSync, fileSync } = new TempFiles();

import { DocusaurusDocTree } from "@src/lib/docusaurus/tree/DocusaurusDocTree";

describe("docusaurusDocTree", () => {
  let dir: DirResult;

  beforeEach(() => {
    dir = dirSync({ unsafeCleanup: true });
  });

  afterEach(() => {
    dir.removeCallback();
  });

  it("should be defined", () => {
    expect(DocusaurusDocTree).toBeDefined();
  });

  it("should fail if the directory does not exist", () => {
    expect(() => new DocusaurusDocTree("foo")).toThrow(
      "Path foo does not exist",
    );
  });

  it("should build a tree from a directory", () => {
    expect(new DocusaurusDocTree(dir.name)).toBeInstanceOf(DocusaurusDocTree);
  });

  describe("flattened", () => {
    it("should return a list of DocusaurusDocTreeItem from the root directory files and subdirectories", async () => {
      // Arrange
      const categoryDir = dirSync({ dir: dir.name, name: "category" });
      const categoryIndex = fileSync({
        dir: categoryDir.name,
        name: "index.md",
      });
      writeFileSync(
        categoryIndex.name,
        dedent`
        ---
        title: Category
        sync_to_confluence: true
        ---
        
        # Hello World
        `,
      );
      const file = fileSync({ dir: dir.name, name: "page.md" });
      writeFileSync(
        file.name,
        dedent`
        ---
        title: Page
        sync_to_confluence: true
        ---
        
        # Hello World
        `,
      );

      // Act
      const tree = new DocusaurusDocTree(dir.name);
      const flattened = await tree.flatten();

      // Assert
      expect(flattened).toHaveLength(2);
      expect(flattened[0].path).toBe(join(categoryDir.name, "index.md"));
      expect(flattened[0].isCategory).toBe(true);
      expect(flattened[0].meta.title).toBe("Category");
      expect(flattened[0].content).toContain("Hello World");
      expect(flattened[1].path).toBe(file.name);
      expect(flattened[1].isCategory).toBe(false);
      expect(flattened[1].meta.title).toBe("Page");
      expect(flattened[1].content).toContain("Hello World");
    });

    it("should ignore index.md in the root directory", async () => {
      // Arrange
      const logs: LogMessage[] = [];
      const logger = new Logger(
        "DocusaurusDocTree",
        { level: "warn" },
        { globalStore: logs },
      );
      logger.setLevel("silent", { transport: "console" });
      const file = fileSync({ dir: dir.name, name: "index.md" });
      writeFileSync(
        file.name,
        dedent`
        ---
        title: Category
        sync_to_confluence: true
        ---
        
        # Hello World
        `,
      );

      // Act
      const tree = new DocusaurusDocTree(dir.name, { logger });
      const flattened = await tree.flatten();

      // Assert
      expect(flattened).toHaveLength(0);
      expect(logs).toContainEqual(
        expect.stringContaining("Ignoring index.md file in root directory."),
      );
    });

    it("should ignore files in the root directory that are not configured to be synced to confluence", async () => {
      // Arrange
      const categoryDir = dirSync({ dir: dir.name });
      const categoryIndex = fileSync({
        dir: categoryDir.name,
        name: "index.md",
      });
      writeFileSync(
        categoryIndex.name,
        dedent`
        ---
        title: Category
        sync_to_confluence: false
        ---
        
        # Hello World
        `,
      );
      const page = fileSync({ dir: dir.name, name: "page.md" });
      writeFileSync(
        page.name,
        dedent`
        ---
        title: Page
        sync_to_confluence: false
        ---
        
        # Hello World
        `,
      );

      // Act
      const tree = new DocusaurusDocTree(dir.name);
      const flattened = await tree.flatten();

      // Assert
      expect(flattened).toHaveLength(0);
    });
  });
});
