// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

import type { ConfigInterface } from "@mocks-server/config";
import { Config } from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";
import { Logger } from "@mocks-server/logger";
import type { DirResult } from "tmp";
import { dedent } from "ts-dedent";

import { TempFiles } from "@support/utils/TempFiles";
const { dirSync, fileSync } = new TempFiles();

import type {
  MarkdownDocumentsInterface,
  MarkdownDocumentsOptions,
  FilesPatternOption,
  ModeOption,
  FilesMetadataOption,
} from "@src/lib";
import { MarkdownDocuments } from "@src/lib/docusaurus/DocusaurusPages";
import * as typesValidations from "@src/lib/support/typesValidations";

const CONFIG = {
  config: {
    readArguments: false,
    readFile: false,
    readEnvironment: false,
  },
};

describe("docusaurusPages", () => {
  let dir: DirResult;
  let config: ConfigInterface;
  let logger: LoggerInterface;
  let docusaurusPagesOptions: MarkdownDocumentsOptions;

  beforeEach(async () => {
    dir = dirSync({ unsafeCleanup: true });
    config = new Config({
      moduleName: "markdown-confluence-sync",
    });
    config.addOption({
      name: "mode",
      type: "string",
      default: "tree",
    });
    config.addOption({
      name: "filesPattern",
      type: "string",
      default: "",
    });

    config.addOption({
      name: "filesMetadata",
      type: "array",
      default: [],
    });

    logger = new Logger("", { level: "silent" });
    docusaurusPagesOptions = {
      config,
      logger,
      mode: config.option("mode") as ModeOption,
      filesMetadata: config.option("filesMetadata") as FilesMetadataOption,
      cwd: process.cwd(),
    };
  });

  afterEach(() => {
    dir.removeCallback();
  });

  it("should be defined", () => {
    expect(MarkdownDocuments).toBeDefined();
  });

  describe("read", () => {
    it("should initialized once", async () => {
      // Arrange
      const docusaurusPages = new MarkdownDocuments(docusaurusPagesOptions);
      await config.load({
        ...CONFIG,
        docsDir: dir.name,
      });

      // Act
      await docusaurusPages.read();
      await docusaurusPages.read();

      // Assert
      expect(docusaurusPages).toBeInstanceOf(MarkdownDocuments);
    });

    it("should fail if the directory does not exist", async () => {
      // Arrange
      const docusaurusPages = new MarkdownDocuments(docusaurusPagesOptions);
      await config.load({
        ...CONFIG,
        docsDir: "foo",
      });

      // Act
      // Assert
      await expect(async () => await docusaurusPages.read()).rejects.toThrow(
        `Path ${resolve(process.cwd(), "foo")} does not exist`,
      );
    });

    it("should build a tree from a directory", async () => {
      // Arrange
      const docusaurusPages = new MarkdownDocuments(docusaurusPagesOptions);
      await config.load({
        ...CONFIG,
        docsDir: dir.name,
      });

      // Act
      // Assert
      expect(docusaurusPages).toBeInstanceOf(MarkdownDocuments);
    });

    describe("with valid directory", () => {
      let docusaurusPages: MarkdownDocumentsInterface;

      beforeEach(async () => {
        docusaurusPages = new MarkdownDocuments(docusaurusPagesOptions);
        await config.load({
          ...CONFIG,
          docsDir: dir.name,
        });
      });

      it("should ignore index.md file in the root directory", async () => {
        // Arrange
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
        const flattened = await docusaurusPages.read();

        // Assert
        expect(flattened).toHaveLength(0);
      });

      it("should ignore files in the root directory that are not configured to be synced to confluence", async () => {
        // Arrange
        const categoryDir = dirSync({ dir: dir.name });
        const file = fileSync({ dir: categoryDir.name, name: "index.md" });
        writeFileSync(
          file.name,
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
        const flattened = await docusaurusPages.read();

        // Assert
        expect(flattened).toHaveLength(0);
      });

      it("should return a list of DocusaurusPage from the root directory files and subdirectories", async () => {
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
        const pages = await docusaurusPages.read();

        // Assert
        expect(pages).toHaveLength(2);
        expect(pages[0].path).toBe(join(categoryDir.name, "index.md"));
        expect(pages[0].relativePath).toBe(join("category", "index.md"));
        expect(pages[0].title).toBe("Category");
        expect(pages[0].content).toContain("Hello World");
        expect(pages[0].ancestors).toEqual([]);
        expect(pages[1].path).toBe(file.name);
        expect(pages[1].relativePath).toBe("page.md");
        expect(pages[1].title).toBe("Page");
        expect(pages[1].content).toContain("Hello World");
        expect(pages[1].ancestors).toEqual([]);
      });

      it("should return a list of DocusaurusPage from the root directory subdirectories with ancestors", async () => {
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
          confluence_short_name: Cat.
          ---

          # Hello World
          `,
        );
        const categoryPage = fileSync({
          dir: categoryDir.name,
          name: "page.md",
        });
        writeFileSync(
          categoryPage.name,
          dedent`
          ---
          title: Page
          sync_to_confluence: true
          ---

          # Hello World
          `,
        );
        const subcategoryDir = dirSync({
          dir: categoryDir.name,
          name: "subcategory",
        });
        const subcategoryIndex = fileSync({
          dir: subcategoryDir.name,
          name: "index.md",
        });
        writeFileSync(
          subcategoryIndex.name,
          dedent`
          ---
          title: Subcategory
          sync_to_confluence: true
          confluence_short_name: Sub-cat.
          ---

          # Hello World
          `,
        );
        const subcategoryPage = fileSync({
          dir: subcategoryDir.name,
          name: "page.md",
        });
        writeFileSync(
          subcategoryPage.name,
          dedent`
          ---
          title: Page
          sync_to_confluence: true
          ---

          # Hello World
          `,
        );

        // Act
        const pages = await docusaurusPages.read();

        // Assert
        expect(pages).toHaveLength(4);

        expect(pages[0].path).toBe(join(categoryDir.name, "index.md"));
        expect(pages[0].relativePath).toBe(join("category", "index.md"));
        expect(pages[0].title).toBe("Category");
        expect(pages[0].content).toContain("Hello World");
        expect(pages[0].ancestors).toEqual([]);
        expect(pages[0].name).toBe("Cat.");

        expect(pages[1].path).toBe(categoryPage.name);
        expect(pages[1].relativePath).toBe(join("category", "page.md"));
        expect(pages[1].title).toBe("Page");
        expect(pages[1].content).toContain("Hello World");
        expect(pages[1].ancestors).toEqual([
          join(categoryDir.name, "index.md"),
        ]);

        expect(pages[2].path).toBe(join(subcategoryDir.name, "index.md"));
        expect(pages[2].relativePath).toBe(
          join("category", "subcategory", "index.md"),
        );
        expect(pages[2].title).toBe("Subcategory");
        expect(pages[2].content).toContain("Hello World");
        expect(pages[2].ancestors).toEqual([
          join(categoryDir.name, "index.md"),
        ]);
        expect(pages[2].name).toBe("Sub-cat.");

        expect(pages[3].path).toBe(subcategoryPage.name);
        expect(pages[3].relativePath).toBe(
          join("category", "subcategory", "page.md"),
        );
        expect(pages[3].title).toBe("Page");
        expect(pages[3].content).toContain("Hello World");
        expect(pages[3].ancestors).toEqual([
          join(categoryDir.name, "index.md"),
          join(subcategoryDir.name, "index.md"),
        ]);
      });

      it("should fail if the short name is an empty string in the frontmatter", async () => {
        const file = fileSync({ dir: dir.name, name: "page.md" });
        writeFileSync(
          file.name,
          dedent`
          ---
          title: Page
          sync_to_confluence: true
          confluence_short_name: ""
          ---

          # Hello World
          `,
        );

        await expect(docusaurusPages.read()).rejects.toThrow(
          expect.objectContaining({
            name: "Error",
            message: expect.stringContaining("Invalid markdown format: "),
          }),
        );
      });

      it("should prioritize the confluence_title from the frontmatter over the title", async () => {
        // Arrange
        const file = fileSync({ dir: dir.name, name: "page.md" });
        writeFileSync(
          file.name,
          dedent`
          ---
          title: Page
          confluence_title: Confluence Title
          sync_to_confluence: true
          ---
          
          # Hello World
          `,
        );

        // Act
        const pages = await docusaurusPages.read();

        // Assert
        expect(pages).toHaveLength(1);
        expect(pages[0].title).toBe("Confluence Title");
      });

      it("should fail if the confluence_title is an empty string in the frontmatter", async () => {
        const file = fileSync({ dir: dir.name, name: "page.md" });
        writeFileSync(
          file.name,
          dedent`
          ---
          title: Page
          confluence_title: ""
          sync_to_confluence: true
          ---

          # Hello World
          `,
        );

        await expect(docusaurusPages.read()).rejects.toThrow(
          expect.objectContaining({
            name: "Error",
            message: expect.stringContaining("Invalid markdown format: "),
          }),
        );
      });
    });

    describe("when providing files metadata", () => {
      let docusaurusPages: MarkdownDocumentsInterface;

      beforeEach(async () => {
        docusaurusPages = new MarkdownDocuments({
          ...docusaurusPagesOptions,
        });
      });

      it("should ignore index.md file in the root directory", async () => {
        await config.load({
          ...CONFIG,
          docsDir: dir.name,
          filesMetadata: [
            {
              path: join(dir.name, "index.md"),
              title: "Category",
              sync: true,
            },
          ],
        });

        // Arrange
        const file = fileSync({ dir: dir.name, name: "index.md" });
        writeFileSync(
          file.name,
          dedent`
          # Hello World
          `,
        );

        // Act
        const flattened = await docusaurusPages.read();

        // Assert
        expect(flattened).toHaveLength(0);
      });

      it("should ignore files in the root directory that are not configured to be synced to confluence", async () => {
        const categoryDir = dirSync({ dir: dir.name });
        // Arrange
        await config.load({
          ...CONFIG,
          docsDir: dir.name,
          filesMetadata: [
            {
              path: join(categoryDir.name, "index.md"),
              title: "Category",
              sync: false,
            },
            {
              path: join(dir.name, "page.md"),
              title: "Page",
              sync: false,
            },
          ],
        });
        const file = fileSync({ dir: categoryDir.name, name: "index.md" });
        writeFileSync(
          file.name,
          dedent`
          # Hello World
          `,
        );
        const page = fileSync({ dir: dir.name, name: "page.md" });
        writeFileSync(
          page.name,
          dedent`
          # Hello World
          `,
        );

        // Act
        const flattened = await docusaurusPages.read();

        // Assert
        expect(flattened).toHaveLength(0);
      });

      it("should return a list of DocusaurusPage from the root directory files and subdirectories", async () => {
        const categoryDir = dirSync({ dir: dir.name, name: "category" });
        await config.load({
          ...CONFIG,
          docsDir: dir.name,
          filesMetadata: [
            {
              path: join(categoryDir.name, "index.md"),
              title: "Category",
              sync: true,
            },
            {
              path: join(dir.name, "page.md"),
              title: "Page",
              sync: true,
            },
          ],
        });
        // Arrange
        const categoryIndex = fileSync({
          dir: categoryDir.name,
          name: "index.md",
        });
        writeFileSync(
          categoryIndex.name,
          dedent`
          # Hello World Category
          `,
        );
        const file = fileSync({ dir: dir.name, name: "page.md" });
        writeFileSync(
          file.name,
          dedent`
          # Hello World Page
          `,
        );

        // Act
        const pages = await docusaurusPages.read();

        // Assert
        expect(pages).toHaveLength(2);
        expect(pages[0].path).toBe(join(categoryDir.name, "index.md"));
        expect(pages[0].relativePath).toBe(join("category", "index.md"));
        expect(pages[0].title).toBe("Category");
        expect(pages[0].content).toContain("Hello World Category");
        expect(pages[0].ancestors).toEqual([]);
        expect(pages[1].path).toBe(file.name);
        expect(pages[1].relativePath).toBe("page.md");
        expect(pages[1].title).toBe("Page");
        expect(pages[1].content).toContain("Hello World Page");
        expect(pages[1].ancestors).toEqual([]);
      });

      it("should return a list of DocusaurusPage from the root directory subdirectories with ancestors", async () => {
        // Arrange
        const categoryDir = dirSync({ dir: dir.name, name: "category" });
        const subcategoryDir = dirSync({
          dir: categoryDir.name,
          name: "subcategory",
        });

        await config.load({
          ...CONFIG,
          docsDir: dir.name,
          filesMetadata: [
            {
              path: join(categoryDir.name, "index.md"),
              title: "Category",
              shortName: "Cat.",
              sync: true,
            },
            {
              path: join(categoryDir.name, "page.md"),
              title: "Page",
              sync: true,
            },
            {
              path: join(subcategoryDir.name, "index.md"),
              title: "Subcategory",
              shortName: "Sub-cat.",
              sync: true,
            },
            {
              path: join(subcategoryDir.name, "page.md"),
              title: "Page",
              sync: true,
            },
          ],
        });

        const categoryIndex = fileSync({
          dir: categoryDir.name,
          name: "index.md",
        });
        writeFileSync(
          categoryIndex.name,
          dedent`
          # Hello World
          `,
        );
        const categoryPage = fileSync({
          dir: categoryDir.name,
          name: "page.md",
        });
        writeFileSync(
          categoryPage.name,
          dedent`
          # Hello World
          `,
        );
        const subcategoryIndex = fileSync({
          dir: subcategoryDir.name,
          name: "index.md",
        });
        writeFileSync(
          subcategoryIndex.name,
          dedent`
          # Hello World
          `,
        );
        const subcategoryPage = fileSync({
          dir: subcategoryDir.name,
          name: "page.md",
        });
        writeFileSync(
          subcategoryPage.name,
          dedent`
          # Hello World
          `,
        );

        // Act
        const pages = await docusaurusPages.read();

        // Assert
        expect(pages).toHaveLength(4);

        expect(pages[0].path).toBe(join(categoryDir.name, "index.md"));
        expect(pages[0].relativePath).toBe(join("category", "index.md"));
        expect(pages[0].title).toBe("Category");
        expect(pages[0].content).toContain("Hello World");
        expect(pages[0].ancestors).toEqual([]);
        expect(pages[0].name).toBe("Cat.");

        expect(pages[1].path).toBe(categoryPage.name);
        expect(pages[1].relativePath).toBe(join("category", "page.md"));
        expect(pages[1].title).toBe("Page");
        expect(pages[1].content).toContain("Hello World");
        expect(pages[1].ancestors).toEqual([
          join(categoryDir.name, "index.md"),
        ]);

        expect(pages[2].path).toBe(join(subcategoryDir.name, "index.md"));
        expect(pages[2].relativePath).toBe(
          join("category", "subcategory", "index.md"),
        );
        expect(pages[2].title).toBe("Subcategory");
        expect(pages[2].content).toContain("Hello World");
        expect(pages[2].ancestors).toEqual([
          join(categoryDir.name, "index.md"),
        ]);
        expect(pages[2].name).toBe("Sub-cat.");

        expect(pages[3].path).toBe(subcategoryPage.name);
        expect(pages[3].relativePath).toBe(
          join("category", "subcategory", "page.md"),
        );
        expect(pages[3].title).toBe("Page");
        expect(pages[3].content).toContain("Hello World");
        expect(pages[3].ancestors).toEqual([
          join(categoryDir.name, "index.md"),
          join(subcategoryDir.name, "index.md"),
        ]);
      });

      // TODO: Check that prioritizes always metadata from config over frontmatter
      it("should prioritize the confluence_title from the metadata over titles from frontmatter", async () => {
        // Arrange
        const file = fileSync({ dir: dir.name, name: "page.md" });
        writeFileSync(
          file.name,
          dedent`
          ---
          title: Page
          confluence_title: Confluence Title
          sync_to_confluence: true
          ---
          
          # Hello World
          `,
        );

        await config.load({
          ...CONFIG,
          docsDir: dir.name,
          filesMetadata: [
            {
              path: join(dir.name, "page.md"),
              title: "Foo Page",
              sync: true,
            },
          ],
        });

        // Act
        const pages = await docusaurusPages.read();

        // Assert
        expect(pages).toHaveLength(1);
        expect(pages[0].title).toBe("Foo Page");
      });
    });

    describe("when file is mdx", () => {
      let docusaurusPages: MarkdownDocumentsInterface;

      beforeEach(async () => {
        docusaurusPages = new MarkdownDocuments(docusaurusPagesOptions);
        await config.load({
          ...CONFIG,
          docsDir: dir.name,
        });
      });

      it("should read pages in mdx files directory", async () => {
        // Arrange
        const mdxFileDir = dirSync({ dir: dir.name, name: "mdx-files" });
        const indexFile = fileSync({ dir: mdxFileDir.name, name: "index.mdx" });
        writeFileSync(
          indexFile.name,
          dedent`
          ---
          title: File Mdx
          sync_to_confluence: true
          ---
          
          # Hello World
        `,
        );

        const mdxPageDir = fileSync({
          dir: mdxFileDir.name,
          name: "mdxPage.mdx",
        });
        writeFileSync(
          mdxPageDir.name,
          dedent`
          ---
          title: Mdx Page
          sync_to_confluence: true
          ---

          # Hello World
          `,
        );

        // Act
        const pages = await docusaurusPages.read();

        // Assert
        expect(pages).toHaveLength(2);
      });
    });

    describe("index files", () => {
      describe.each([
        "README.md",
        "README.mdx",
        "directory-name.md",
        "directory-name.mdx",
      ])("when index file is %s", (indexFileName) => {
        let docusaurusPages: MarkdownDocumentsInterface;

        beforeEach(async () => {
          docusaurusPages = new MarkdownDocuments(docusaurusPagesOptions);
          await config.load({
            ...CONFIG,
            docsDir: dir.name,
          });
        });

        it(`should read a ${indexFileName} file in the directory as index file`, async () => {
          // Arrange
          const readmeDir = dirSync({ dir: dir.name, name: "directory-name" });
          const indexFile = fileSync({
            dir: readmeDir.name,
            name: indexFileName,
          });
          writeFileSync(
            indexFile.name,
            dedent`
          ---
          title: Title
          sync_to_confluence: true
          ---

          # Hello World
          `,
          );

          const mdxPageDir = fileSync({
            dir: readmeDir.name,
            name: "mdxPage.mdx",
          });
          writeFileSync(
            mdxPageDir.name,
            dedent`
          ---
          title: Mdx Page
          sync_to_confluence: true
          ---

          # Hello World
          `,
          );

          // Act
          const pages = await docusaurusPages.read();

          // Assert
          expect(pages).toHaveLength(2);
          expect(pages[0].ancestors).toEqual([]);
          expect(pages[1].ancestors).toEqual([
            join(readmeDir.name, indexFileName),
          ]);
        });
      });

      describe("when there are multiple index files in the directory", () => {
        let docusaurusPages: MarkdownDocumentsInterface;

        beforeEach(async () => {
          logger = new Logger("docusaurus-pages-index-files", {
            level: "warn",
          });
          docusaurusPagesOptions = {
            config,
            logger,
            mode: config.option("mode") as ModeOption,
            cwd: process.cwd(),
          };
          docusaurusPages = new MarkdownDocuments(docusaurusPagesOptions);
          await config.load({
            ...CONFIG,
            docsDir: dir.name,
          });
        });

        it("should read the file with higher order of precedence as index file", async () => {
          // Arrange
          const exampleDir = dirSync({ dir: dir.name, name: "example" });
          const indexFile = fileSync({
            dir: exampleDir.name,
            name: "index.md",
          });
          writeFileSync(
            indexFile.name,
            dedent`
          ---
          title: index.md
          sync_to_confluence: true
          ---
          # Hello World
          `,
          );

          const indexFile2 = fileSync({
            dir: exampleDir.name,
            name: "example.md",
          });
          writeFileSync(
            indexFile2.name,
            dedent`
          ---
          title: example.md
          sync_to_confluence: true
          ---
          # Hello World
          `,
          );

          // Act
          const pages = await docusaurusPages.read();

          // Assert
          expect(pages).toHaveLength(1);
          expect(pages[0].title).toBe("index.md");
          expect(pages[0].ancestors).toEqual([]);
        });

        it("should log a warning message", async () => {
          // Arrange
          const exampleDir = dirSync({ dir: dir.name, name: "example" });
          const indexFile = fileSync({
            dir: exampleDir.name,
            name: "index.md",
          });
          writeFileSync(
            indexFile.name,
            dedent`
          ---
          title: index.md
          sync_to_confluence: true
          ---
          # Hello World
          `,
          );

          const indexFile2 = fileSync({
            dir: exampleDir.name,
            name: "example.md",
          });
          writeFileSync(
            indexFile2.name,
            dedent`
          ---
          title: example.md
          sync_to_confluence: true
          ---
          # Hello World
          `,
          );

          // Act
          await docusaurusPages.read();

          // Assert
          expect(logger.globalStore).toEqual(
            expect.arrayContaining([
              expect.stringContaining(
                `Multiple index files found in ${basename(
                  exampleDir.name,
                )} directory. Using ${basename(indexFile.name)} as index file. Ignoring the rest.`,
              ),
            ]),
          );
        });
      });
    });

    describe("when flat mode is active", () => {
      let docusaurusPages: MarkdownDocumentsInterface;

      it("should throw an error when 'filesPattern' option is empty", async () => {
        docusaurusPages = new MarkdownDocuments(docusaurusPagesOptions);
        await config.load({
          ...CONFIG,
          mode: "flat",
        });

        // Assert
        await expect(async () => await docusaurusPages.read()).rejects.toThrow(
          `File pattern can't be empty in flat mode`,
        );
      });

      it("should read the pages whose filenames match the glob pattern provided in the filesPattern option", async () => {
        // Arrange
        await config.load({
          ...CONFIG,
          mode: "flat",
          filesPattern: "**/page*",
        });
        docusaurusPages = new MarkdownDocuments({
          ...docusaurusPagesOptions,
          filesPattern: config.option("filesPattern") as FilesPatternOption,
          cwd: dir.name,
        });

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
            confluence_short_name: Cat.
            ---

            # Hello World
          `,
        );
        const categoryPage = fileSync({
          dir: categoryDir.name,
          name: "page.md",
        });
        writeFileSync(
          categoryPage.name,
          dedent`
            ---
            title: Page
            sync_to_confluence: true
            ---

            # Hello World
          `,
        );
        const subcategoryDir = dirSync({
          dir: categoryDir.name,
          name: "subcategory",
        });
        const subcategoryIndex = fileSync({
          dir: subcategoryDir.name,
          name: "index.md",
        });
        writeFileSync(
          subcategoryIndex.name,
          dedent`
            ---
            title: Subcategory
            sync_to_confluence: true
            confluence_short_name: Sub-cat.
            ---

            # Hello World
          `,
        );
        const subcategoryPage = fileSync({
          dir: subcategoryDir.name,
          name: "page.mdx",
        });
        writeFileSync(
          subcategoryPage.name,
          dedent`
            ---
            title: Page
            sync_to_confluence: true
            ---

            # Hello World
          `,
        );

        // Act
        const pages = await docusaurusPages.read();

        // Assert
        expect(pages).toHaveLength(2);
      });

      it("when MarkdownDocuments read method is called twice, the initial validation should be called only once", async () => {
        const spyIsStringWithLength = jest.spyOn(
          typesValidations,
          "isStringWithLength",
        );

        // Arrange
        await config.load({
          ...CONFIG,
          mode: "flat",
          filesPattern: "**/page*",
        });
        docusaurusPages = new MarkdownDocuments({
          ...docusaurusPagesOptions,
          filesPattern: config.option("filesPattern") as FilesPatternOption,
          cwd: dir.name,
        });

        // Act
        await docusaurusPages.read();
        await docusaurusPages.read();

        // Assert
        expect(spyIsStringWithLength).toHaveBeenCalledTimes(1);
      });
    });

    describe("when id mode is active", () => {
      let docusaurusPages: MarkdownDocumentsInterface;

      it("should throw an error when 'filesPattern' option is empty", async () => {
        docusaurusPages = new MarkdownDocuments(docusaurusPagesOptions);
        await config.load({
          ...CONFIG,
          mode: "id",
        });

        // Assert
        await expect(async () => await docusaurusPages.read()).rejects.toThrow(
          `File pattern can't be empty in id mode`,
        );
      });

      it("should read the pages whose filenames match the glob pattern provided in the filesPattern option", async () => {
        // Arrange
        await config.load({
          ...CONFIG,
          mode: "id",
          filesPattern: "**/page*",
        });
        docusaurusPages = new MarkdownDocuments({
          ...docusaurusPagesOptions,
          filesPattern: config.option("filesPattern") as FilesPatternOption,
          cwd: dir.name,
        });

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
            confluence_short_name: Cat.
            ---

            # Hello World
          `,
        );
        const categoryPage = fileSync({
          dir: categoryDir.name,
          name: "page.md",
        });
        writeFileSync(
          categoryPage.name,
          dedent`
            ---
            title: Page
            sync_to_confluence: true
            ---

            # Hello World
          `,
        );
        const subcategoryDir = dirSync({
          dir: categoryDir.name,
          name: "subcategory",
        });
        const subcategoryIndex = fileSync({
          dir: subcategoryDir.name,
          name: "index.md",
        });
        writeFileSync(
          subcategoryIndex.name,
          dedent`
            ---
            title: Subcategory
            sync_to_confluence: true
            confluence_short_name: Sub-cat.
            ---

            # Hello World
          `,
        );
        const subcategoryPage = fileSync({
          dir: subcategoryDir.name,
          name: "page.mdx",
        });
        writeFileSync(
          subcategoryPage.name,
          dedent`
            ---
            title: Page
            sync_to_confluence: true
            ---

            # Hello World
          `,
        );

        // Act
        const pages = await docusaurusPages.read();

        // Assert
        expect(pages).toHaveLength(2);
      });
    });
  });
});
