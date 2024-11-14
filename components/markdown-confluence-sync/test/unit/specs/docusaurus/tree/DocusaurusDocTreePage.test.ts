import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";

import { Logger } from "@mocks-server/logger";
import type { DirResult, FileResult } from "tmp";
import { dedent } from "ts-dedent";

import { TempFiles } from "@support/utils/TempFiles";
const { dirSync, fileSync } = new TempFiles();

import { InvalidMarkdownFormatException } from "@src/lib/docusaurus/pages/errors/InvalidMarkdownFormatException";
import { InvalidPathException } from "@src/lib/docusaurus/pages/errors/InvalidPathException";
import { PathNotExistException } from "@src/lib/docusaurus/pages/errors/PathNotExistException";
import { DocusaurusDocTreePage } from "@src/lib/docusaurus/tree/DocusaurusDocTreePage";

describe("docusaurusDocTreePage", () => {
  let dir: DirResult;
  let file: FileResult;

  beforeEach(() => {
    dir = dirSync({ unsafeCleanup: true });
    file = fileSync({ dir: dir.name, postfix: ".md" });
  });

  afterEach(() => {
    dir.removeCallback();
  });

  it("should be defined", () => {
    expect(DocusaurusDocTreePage).toBeDefined();
  });

  it("should fail if the file does not exist", () => {
    expect(() => new DocusaurusDocTreePage(`/tmp/${randomUUID()}.md`)).toThrow(
      PathNotExistException,
    );
  });

  it("should fail if the path is not a file", () => {
    // Arrange
    const emptyDir = dirSync({ dir: dir.name });

    // Act
    // Assert
    expect(() => new DocusaurusDocTreePage(emptyDir.name)).toThrow(
      InvalidPathException,
    );
  });

  it("should fail if the file is not a Markdown file", () => {
    // Arrange
    const txtFile = fileSync({ dir: dir.name, postfix: ".txt" });

    // Act
    // Assert
    expect(() => new DocusaurusDocTreePage(txtFile.name)).toThrow(
      InvalidPathException,
    );
  });

  it("should fail if the file does not contain frontmatter metadata", () => {
    // Arrange
    const mdFile = fileSync({ dir: dir.name, postfix: ".md" });
    writeFileSync(mdFile.name, "# Hello World");

    // Act
    // Assert
    expect(() => new DocusaurusDocTreePage(mdFile.name)).toThrow(
      InvalidMarkdownFormatException,
    );
  });

  it("should fail if the file does not contain title in frontmatter metadata", () => {
    // Arrange
    const mdFile = fileSync({ dir: dir.name, postfix: ".md" });
    writeFileSync(
      mdFile.name,
      dedent`
      ---
      test: Test
      ---

      # Hello World
      `,
    );

    // Act
    // Assert
    expect(() => new DocusaurusDocTreePage(mdFile.name)).toThrow(
      InvalidMarkdownFormatException,
    );
  });

  it("should build a page from a file", () => {
    // Arrange
    writeFileSync(
      file.name,
      dedent`
      ---
      title: Test
      sync_to_confluence: true
      ---

      # Hello World
      `,
    );

    // Act
    const page = new DocusaurusDocTreePage(file.name);

    // Assert
    expect(page.isCategory).toBe(false);
    expect(page.path).toBe(file.name);
    expect(page.content).toContain("Hello World");
    expect(page.meta).toBeDefined();
    expect(page.meta.title).toBe("Test");
    expect(page.meta.syncToConfluence).toBe(true);
  });

  it("should set syncToConfluence to false if not specified", () => {
    // Arrange
    writeFileSync(
      file.name,
      dedent`
      ---
      title: Test
      ---

      # Hello World
      `,
    );

    // Act
    const page = new DocusaurusDocTreePage(file.name);

    // Assert
    expect(page.meta.syncToConfluence).toBe(false);
  });

  describe("confluence short name", () => {
    it("should read name from metadata", () => {
      // Arrange
      const indexFile = fileSync({ dir: dir.name, name: "index.md" });
      writeFileSync(
        indexFile.name,
        dedent`
      ---
      title: Page
      confluence_short_name: Page name
      ---

      # Hello World
      `,
      );

      // Act
      const page = new DocusaurusDocTreePage(indexFile.name);

      // Assert
      expect(page.meta.confluenceShortName).toBe("Page name");
    });

    it("should log warning if file is not index.md", () => {
      // Arrange
      const testFile = fileSync({ dir: dir.name, name: "test.md" });
      writeFileSync(
        testFile.name,
        dedent`
        ---
        title: Test
        confluence_short_name: Test name
        ---

        # Hello World
        `,
      );
      const logger = new Logger("docusaurus-doc-tree-page", { level: "warn" });
      logger.setLevel("silent", { transport: "console" });

      // Act
      const page = new DocusaurusDocTreePage(testFile.name, { logger });

      // Assert
      expect(page.meta.confluenceShortName).toBe("Test name");
      expect(logger.store).toEqual(
        expect.arrayContaining([
          expect.stringContaining(
            "An unnecessary confluence short name has been set for test.md that is not an index file. This confluence short name will be ignored.",
          ),
        ]),
      );
    });
  });

  describe("confluence title", () => {
    it("should read title from metadata", () => {
      // Arrange
      const indexFile = fileSync({ dir: dir.name, name: "index.md" });
      writeFileSync(
        indexFile.name,
        dedent`
      ---
      title: Page
      confluence_title: Page title
      ---

      # Hello World
      `,
      );

      // Act
      const page = new DocusaurusDocTreePage(indexFile.name);

      // Assert
      expect(page.meta.confluenceTitle).toBe("Page title");
    });
  });

  describe("docusaurus admonitions", () => {
    it("should process docusaurus admonitions with title", () => {
      // Arrange
      writeFileSync(
        file.name,
        dedent`
        ---
        title: Test
        ---

        # Hello World

        :::note Note title
        This is a note
        :::
        `,
      );

      // Act
      const page = new DocusaurusDocTreePage(file.name);

      // Assert
      expect(page.content).toContain("Hello World");
      expect(page.content).toContain("This is a note");
      expect(page.content).toContain("Note: Note title");
    });

    it("should process docusaurus admonitions without title", () => {
      // Arrange
      writeFileSync(
        file.name,
        dedent`
        ---
        title: Test
        ---

        # Hello World

        :::note
        This is a note
        :::
        `,
      );

      // Act
      const page = new DocusaurusDocTreePage(file.name);

      // Assert
      expect(page.content).toContain("Hello World");
      expect(page.content).toContain("This is a note");
      expect(page.content).toContain("Note:");
    });
  });

  describe("visited", () => {
    it("should return an empty array if the page is not to be synced", async () => {
      // Arrange
      writeFileSync(
        file.name,
        dedent`
        ---
        title: Test
        sync_to_confluence: false
        ---

        # Hello World
        `,
      );
      const page = new DocusaurusDocTreePage(file.name);

      // Act
      const result = await page.visit();

      // Assert
      expect(result).toEqual([]);
    });

    it("should return an array with the page if the page is to be synced", async () => {
      // Arrange
      writeFileSync(
        file.name,
        dedent`
        ---
        title: Test
        sync_to_confluence: true
        ---

        # Hello World
        `,
      );
      const page = new DocusaurusDocTreePage(file.name);

      // Act
      const result = await page.visit();

      // Assert
      expect(result).toEqual([page]);
    });
  });
});
