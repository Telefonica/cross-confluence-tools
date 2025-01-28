// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { basename, join } from "node:path";

import type { DirResult, FileResult } from "tmp";
import { dedent } from "ts-dedent";

import { TempFiles } from "@support/utils/TempFiles";
const { dirSync, fileSync } = new TempFiles();

import { InvalidPathException } from "@src/lib/docusaurus/pages/errors/InvalidPathException";
import { PathNotExistException } from "@src/lib/docusaurus/pages/errors/PathNotExistException";
import { DocusaurusDocTreeCategory } from "@src/lib/docusaurus/tree/DocusaurusDocTreeCategory";
import { TitleRequiredException } from "@src/lib/docusaurus/pages/errors/TitleRequiredException";

describe("docusaurusDocTreeCategory", () => {
  let dir: DirResult;

  beforeEach(() => {
    dir = dirSync({ unsafeCleanup: true });
  });

  afterEach(() => {
    dir.removeCallback();
  });

  it("should be defined", () => {
    expect(DocusaurusDocTreeCategory).toBeDefined();
  });

  it("should fail if the path does not exist", () => {
    expect(() => new DocusaurusDocTreeCategory(`/tmp/${randomUUID()}`)).toThrow(
      PathNotExistException,
    );
  });

  it("should fail if the path is not a directory", () => {
    // Arrange
    const file = fileSync({ dir: dir.name, postfix: ".txt" });

    // Act
    // Assert
    expect(() => new DocusaurusDocTreeCategory(file.name)).toThrow(
      InvalidPathException,
    );
  });

  it("should fail if the path index.md file does not have title defined", () => {
    // Arrange
    const categoryDir = dirSync({ dir: dir.name });
    const categoryIndex = fileSync({ dir: categoryDir.name, name: "index.md" });
    writeFileSync(categoryIndex.name, "# Hello World");

    // Act
    // Assert
    expect(() => new DocusaurusDocTreeCategory(categoryDir.name)).toThrow(
      TitleRequiredException,
    );
  });

  it("should build a category if the path does not have an index.md file", () => {
    // Arrange
    const emptyDir = dirSync({ dir: dir.name });

    // Act
    const category = new DocusaurusDocTreeCategory(emptyDir.name);

    // Assert
    expect(category).toBeDefined();
    expect(category.isCategory).toBe(true);
    expect(category.path).toBe(join(emptyDir.name, "index.md"));
    expect(category.meta).toBeDefined();
    expect(category.meta.title).toBe(basename(emptyDir.name));
    expect(category.meta.syncToConfluence).toBeTruthy();
    expect(category.content).toBe("");
  });

  it("should build a category from a directory with an index.md file", () => {
    // Arrange
    const index = fileSync({ dir: dir.name, name: "index.md" });
    writeFileSync(
      index.name,
      dedent`
      ---
      title: Title
      ---

      # Hello World
      `,
    );

    // Act
    const category = new DocusaurusDocTreeCategory(dir.name);

    // Assert
    expect(category).toBeDefined();
    expect(category.isCategory).toBe(true);
    expect(category.path).toBe(join(dir.name, "index.md"));
    expect(category.meta).toBeDefined();
    expect(category.meta.title).toBe("Title");
    expect(category.content).toContain("Hello World");
  });

  it("should inherit the confluence short name from index.md file", () => {
    // Arrange
    const index = fileSync({ dir: dir.name, name: "index.md" });
    writeFileSync(
      index.name,
      dedent`
      ---
      title: Title
      confluence_short_name: Title Name
      ---

      # Hello World
      `,
    );

    // Act
    const category = new DocusaurusDocTreeCategory(dir.name);

    // Assert
    expect(category.meta.confluenceShortName).toBe("Title Name");
  });

  it("should inherit the confluence title from index.md file", () => {
    // Arrange
    const index = fileSync({ dir: dir.name, name: "index.md" });
    writeFileSync(
      index.name,
      dedent`
      ---
      title: Title
      confluence_title: Title Name
      ---

      # Hello World
      `,
    );

    // Act
    const category = new DocusaurusDocTreeCategory(dir.name);

    // Assert
    expect(category.meta.confluenceTitle).toBe("Title Name");
  });

  describe("extend category metadata", () => {
    describe("with yaml format", () => {
      it("should failed if the _category_.yml file is not a valid YAML", () => {
        // Arrange
        const categoryYml = fileSync({ dir: dir.name, name: "_category_.yml" });
        writeFileSync(categoryYml.name, "test: 'should fail");

        // Act
        // Assert
        expect(() => new DocusaurusDocTreeCategory(dir.name)).toThrow();
      });

      it("should extend the metadata from the _category_.yml file", () => {
        // Arrange
        const categoryYml = fileSync({ dir: dir.name, name: "_category_.yml" });
        writeFileSync(
          categoryYml.name,
          dedent`---
          label: Category Title
          `,
        );
        // Act
        const category = new DocusaurusDocTreeCategory(dir.name);

        // Assert
        try {
          expect(category.meta?.title).toBe("Category Title");
        } finally {
          categoryYml.removeCallback();
        }
      });

      it("should extend the metadata from the _category_.yaml file", () => {
        // Arrange
        const categoryYml = fileSync({
          dir: dir.name,
          name: "_category_.yaml",
        });
        writeFileSync(
          categoryYml.name,
          dedent`---
          label: Category Title
          `,
        );
        // Act
        const category = new DocusaurusDocTreeCategory(dir.name);

        // Assert
        expect(category.meta?.title).toBe("Category Title");
      });
    });

    describe("with json format", () => {
      it("should failed if the _category_.json file is not a valid YAML", () => {
        // Arrange
        const categoryJson = fileSync({
          dir: dir.name,
          name: "_category_.json",
        });
        writeFileSync(categoryJson.name, `{"test": "should fail"`);

        // Act
        // Assert
        expect(() => new DocusaurusDocTreeCategory(dir.name)).toThrow();
      });

      it("should extend the metadata from the _category_.json file", () => {
        // Arrange
        const categoryJson = fileSync({
          dir: dir.name,
          name: "_category_.json",
        });
        writeFileSync(
          categoryJson.name,
          dedent`---
          {
            "label": "Category Title"
          }
          `,
        );
        // Act
        const category = new DocusaurusDocTreeCategory(dir.name);

        // Assert
        expect(category.meta?.title).toBe("Category Title");
      });
    });
  });

  describe("visited", () => {
    it("should return an empty array if the category is not configured to sync to Confluence", async () => {
      // Arrange
      const category = new DocusaurusDocTreeCategory(dir.name);

      // Act
      const result = await category.visit();

      // Assert
      expect(result).toHaveLength(0);
    });

    describe("without index.md file", () => {
      it("should return an empty array if all its children are not configured to sync to Confluence", async () => {
        // Arrange
        const categoryDir = dirSync({ dir: dir.name });
        const subCategory = dirSync({ dir: categoryDir.name });
        const subCategoryIndex = fileSync({
          dir: subCategory.name,
          name: "index.md",
        });
        writeFileSync(
          subCategoryIndex.name,
          dedent`
            ---
            title: Child Title
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
          title: Page Title
          ---

          # Hello World
          `,
        );
        const category = new DocusaurusDocTreeCategory(categoryDir.name);

        // Act
        const result = await category.visit();

        // Assert
        expect(result).toEqual([]);
      });

      it("should return an array with the category and its children if at least one of its children is configured to sync to Confluence", async () => {
        // Arrange
        const categoryDir = dirSync({ dir: dir.name });
        const subCategory = dirSync({
          dir: categoryDir.name,
          name: "subcategory",
        });
        const subCategoryIndex = fileSync({
          dir: subCategory.name,
          name: "index.md",
        });
        writeFileSync(
          subCategoryIndex.name,
          dedent`
            ---
            title: Subcategory Title
            sync_to_confluence: true
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
          title: Page Title
          sync_to_confluence: true
          ---

          # Hello World
          `,
        );
        const category = new DocusaurusDocTreeCategory(categoryDir.name);

        // Act
        const result = await category.visit();

        // Assert
        expect(result).toHaveLength(3);
        expect(result[0]).toBe(category);
        expect(result[1]).toBeDefined();
        expect(result[1].meta.title).toBe("Page Title");
        expect(result[1].isCategory).toBe(false);
        expect(result[1].path).toContain(categoryPage.name);
        expect(result[1].content).toContain("Hello World");
        expect(result[2]).toBeDefined();
        expect(result[2].meta.title).toBe("Subcategory Title");
        expect(result[2].isCategory).toBe(true);
        expect(result[2].path).toContain(subCategory.name);
        expect(result[2].content).toContain("Hello World");
      });
    });

    describe("with index.md file", () => {
      let index: FileResult;

      beforeEach(() => {
        index = fileSync({ dir: dir.name, name: "index.md" });
      });

      it("should return an empty array if the category is not configured to sync to Confluence", async () => {
        // Arrange
        writeFileSync(
          index.name,
          dedent`
          ---
          title: Title
          sync_to_confluence: false
          ---

          # Hello World
          `,
        );
        const category = new DocusaurusDocTreeCategory(dir.name);

        // Act
        const result = await category.visit();

        // Assert
        expect(result).toHaveLength(0);
      });

      describe("configured to sync to Confluence", () => {
        beforeEach(() => {
          writeFileSync(
            index.name,
            dedent`
            ---
            title: Title
            sync_to_confluence: true
            ---

            # Hello World
            `,
          );
        });

        it("should return an array with the category if the category is configured to sync to Confluence", async () => {
          // Arrange
          const category = new DocusaurusDocTreeCategory(dir.name);

          // Act
          const result = await category.visit();

          // Assert
          expect(result).toHaveLength(1);
          expect(result[0]).toBe(category);
        });

        it("should return an array with the category and no children if the category is configured to sync to Confluence and the children are not configured to sync to Confluence", async () => {
          // Arrange
          const childMd = fileSync({ dir: dir.name, postfix: ".md" });
          writeFileSync(
            childMd.name,
            dedent`
            ---
            title: Child Page
            sync_to_confluence: false
            ---
            
            # Hello World
            `,
          );
          const childDir = dirSync({ dir: dir.name });
          const childIndex = fileSync({ dir: childDir.name, name: "index.md" });
          writeFileSync(
            childIndex.name,
            dedent`
            ---
            title: Child Category
            sync_to_confluence: false
            ---
            
            # Hello World
            `,
          );

          const category = new DocusaurusDocTreeCategory(dir.name);

          // Act
          const result = await category.visit();

          // Assert
          expect(result).toHaveLength(1);
          expect(result[0]).toBe(category);
        });

        it("should return an array with the category if is not configured to sync to Confluence", async () => {
          // Arrange
          const childMd = fileSync({ dir: dir.name, postfix: ".mdx" });
          writeFileSync(
            childMd.name,
            dedent`
            ---
            title: Child Page
            sync_to_confluence: false
            ---
            
            # Hello World
            `,
          );

          const category = new DocusaurusDocTreeCategory(dir.name);

          // Act
          const result = await category.visit();

          // Assert
          expect(result).toHaveLength(1);
          expect(result[0]).toBe(category);
        });

        it("should return an array with the category and its children if the category is configured to sync to Confluence and the children are configured to sync to Confluence", async () => {
          // Arrange
          const childPage = fileSync({ dir: dir.name, name: "child-page.md" });
          writeFileSync(
            childPage.name,
            dedent`
            ---
            title: Child Page
            sync_to_confluence: true
            ---
            
            # Hello World
            `,
          );
          const childDir = dirSync({ dir: dir.name, name: "child-category" });
          const childIndex = fileSync({ dir: childDir.name, name: "index.md" });
          writeFileSync(
            childIndex.name,
            dedent`
            ---
            title: Child Category
            sync_to_confluence: true
            ---
            
            # Hello World
            `,
          );
          const category = new DocusaurusDocTreeCategory(dir.name);

          // Act
          const result = await category.visit();

          // Assert
          expect(result).toHaveLength(3);
          expect(result[0]).toBe(category);

          const actualChildCategory = result[1];

          expect(actualChildCategory.path).toBe(
            join(childDir.name, "index.md"),
          );
          expect(actualChildCategory.isCategory).toBe(true);
          expect(actualChildCategory.meta).toEqual(
            expect.objectContaining({ title: "Child Category" }),
          );
          expect(actualChildCategory.content).toContain("Hello World");

          const actualChildPage = result[2];

          expect(actualChildPage.path).toEqual(childPage.name);
          expect(actualChildPage.isCategory).toBe(false);
          expect(actualChildPage.meta).toEqual(
            expect.objectContaining({ title: "Child Page" }),
          );
          expect(actualChildPage.content).toContain("Hello World");
        });
      });
    });
  });
});
