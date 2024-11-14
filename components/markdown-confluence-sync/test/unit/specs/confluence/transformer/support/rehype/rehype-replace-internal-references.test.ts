import { join } from "path";

import { rehype } from "rehype";
import { toVFile } from "to-vfile";

import type { ConfluenceSyncPage } from "@src/lib/confluence/ConfluenceSync.types";
import rehypeReplaceInternalReferences from "@src/lib/confluence/transformer/support/rehype/rehype-replace-internal-references";

describe("rehype-replace-internal-references", () => {
  it("should be defined", () => {
    expect(rehypeReplaceInternalReferences).toBeDefined();
  });

  it("should replace internal references", () => {
    // Arrange
    const path = join(__dirname, "docs/bar.md");
    const input = `<a href="./foo.md">Foo</a>`;
    const expected = `<ac:link><ri:page ri:content-title="Foo" ri:space-key="SPACE_KEY"></ri:page><ac:plain-text-link-body><![CDATA[Foo]]></ac:plain-text-link-body></ac:link>`;
    const spaceKey = "SPACE_KEY";
    const pagePath = join(__dirname, "docs/foo.md");
    const pageRelativePath = "docs/foo.md";
    const pages = new Map<string, ConfluenceSyncPage>([
      [
        pagePath,
        {
          title: "Foo",
          path: pagePath,
          relativePath: pageRelativePath,
          content: "",
          ancestors: [],
        },
      ],
    ]);

    // Act
    const actual = rehype()
      .data("settings", { fragment: true, allowDangerousHtml: true })
      .use(rehypeReplaceInternalReferences, { spaceKey, pages })
      .processSync(toVFile({ path, value: input }))
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should replace internal references one level above", () => {
    // Arrange
    const path = join(__dirname, "docs/bar/bar.md");
    const input = `<a href="../foo.md">Foo</a>`;
    const expected = `<ac:link><ri:page ri:content-title="Foo" ri:space-key="SPACE_KEY"></ri:page><ac:plain-text-link-body><![CDATA[Foo]]></ac:plain-text-link-body></ac:link>`;
    const spaceKey = "SPACE_KEY";
    const pagePath = join(__dirname, "docs/foo.md");
    const pageRelativePath = "docs/foo.md";
    const pages = new Map<string, ConfluenceSyncPage>([
      [
        pagePath,
        {
          title: "Foo",
          path: pagePath,
          relativePath: pageRelativePath,
          content: "",
          ancestors: [],
        },
      ],
    ]);

    // Act
    const actual = rehype()
      .data("settings", { fragment: true, allowDangerousHtml: true })
      .use(rehypeReplaceInternalReferences, { spaceKey, pages })
      .processSync(toVFile({ path, value: input }))
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should replace internal references in one level down", () => {
    // Arrange
    const id = join(__dirname, "docs/bar.md");
    const input = `<a href="./foo/foo.md">Foo</a>`;
    const expected = `<ac:link><ri:page ri:content-title="Foo" ri:space-key="SPACE_KEY"></ri:page><ac:plain-text-link-body><![CDATA[Foo]]></ac:plain-text-link-body></ac:link>`;
    const spaceKey = "SPACE_KEY";
    const pagePath = join(__dirname, "docs/foo/foo.md");
    const pageRelativePath = "docs/foo/foo.md";
    const pages = new Map<string, ConfluenceSyncPage>([
      [
        pagePath,
        {
          title: "Foo",
          path: pagePath,
          relativePath: pageRelativePath,
          content: "",
          ancestors: [],
        },
      ],
    ]);

    // Act
    const actual = rehype()
      .data("settings", { fragment: true, allowDangerousHtml: true })
      .use(rehypeReplaceInternalReferences, { spaceKey, pages })
      .processSync(toVFile({ path: id, value: input }))
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should replace internal references in sibling folder", () => {
    // Arrange
    const path = join(__dirname, "docs/bar/bar.md");
    const input = `<a href="../foo/foo.md">Foo</a>`;
    const expected = `<ac:link><ri:page ri:content-title="Foo" ri:space-key="SPACE_KEY"></ri:page><ac:plain-text-link-body><![CDATA[Foo]]></ac:plain-text-link-body></ac:link>`;
    const spaceKey = "SPACE_KEY";
    const pagePath = join(__dirname, "docs/foo/foo.md");
    const pageRelativePath = "docs/foo/foo.md";
    const pages = new Map<string, ConfluenceSyncPage>([
      [
        pagePath,
        {
          title: "Foo",
          path: pagePath,
          relativePath: pageRelativePath,
          content: "",
          ancestors: [],
        },
      ],
    ]);

    // Act
    const actual = rehype()
      .data("settings", { fragment: true, allowDangerousHtml: true })
      .use(rehypeReplaceInternalReferences, { spaceKey, pages })
      .processSync(toVFile({ path, value: input }))
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should replace references with no text", () => {
    // Arrange
    const path = join(__dirname, "docs/bar.md");
    const input = `<a href="./foo.md"></a>`;
    const expected = `<ac:link><ri:page ri:content-title="Foo" ri:space-key="SPACE_KEY"></ri:page></ac:link>`;
    const spaceKey = "SPACE_KEY";
    const pagePath = join(__dirname, "docs/foo.md");
    const pageRelativePath = "docs/foo.md";
    const pages = new Map<string, ConfluenceSyncPage>([
      [
        pagePath,
        {
          title: "Foo",
          path: pagePath,
          relativePath: pageRelativePath,
          content: "",
          ancestors: [],
        },
      ],
    ]);

    // Act
    const actual = rehype()
      .data("settings", { fragment: true })
      .use(rehypeReplaceInternalReferences, { spaceKey, pages })
      .processSync(toVFile({ path, value: input }))
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should not replace external references", () => {
    // Arrange
    const path = join(__dirname, "docs/bar.md");
    const input = `<a href="https://example.com/foo.md">Foo</a>`;
    const expected = `<a href="https://example.com/foo.md">Foo</a>`;
    const spaceKey = "SPACE_KEY";
    const pages = new Map();

    // Act
    const actual = rehype()
      .data("settings", { fragment: true })
      .use(rehypeReplaceInternalReferences, { spaceKey, pages })
      .processSync(toVFile({ path, value: input }))
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should not replace references with no href", () => {
    // Arrange
    const path = join(__dirname, "docs/bar.md");
    const input = `<a>Foo</a>`;
    const expected = `<a>Foo</a>`;
    const spaceKey = "SPACE_KEY";
    const pages = new Map();

    // Act
    const actual = rehype()
      .data("settings", { fragment: true })
      .use(rehypeReplaceInternalReferences, { spaceKey, pages })
      .processSync(toVFile({ path, value: input }))
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should not replace references to non-existing pages", () => {
    // Arrange
    const path = join(__dirname, "docs/bar.md");
    const input = `<a href="./foo.md">Foo</a>`;
    const expected = `<a href="./foo.md">Foo</a>`;
    const spaceKey = "SPACE_KEY";
    const pages = new Map();

    // Act
    const actual = rehype()
      .data("settings", { fragment: true })
      .use(rehypeReplaceInternalReferences, { spaceKey, pages })
      .processSync(toVFile({ path, value: input }))
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should remove missing pages", () => {
    // Arrange
    const path = join(__dirname, "docs/bar.md");
    const input = `<a href="./foo.md">Foo</a>`;
    const expected = `<span>Foo</span>`;
    const spaceKey = "SPACE_KEY";
    const pages = new Map();

    // Act
    const actual = rehype()
      .data("settings", { fragment: true })
      .use(rehypeReplaceInternalReferences, {
        spaceKey,
        pages,
        removeMissing: true,
      })
      .processSync(toVFile({ path, value: input }))
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });
});
