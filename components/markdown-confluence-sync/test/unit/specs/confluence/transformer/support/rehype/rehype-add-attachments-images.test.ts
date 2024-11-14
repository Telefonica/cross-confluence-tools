import path from "node:path";

import { rehype } from "rehype";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkParseFrontmatter from "remark-parse-frontmatter";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { toVFile } from "to-vfile";
import { dedent } from "ts-dedent";
import { unified } from "unified";

import rehypeAddAttachmentsImages from "@src/lib/confluence/transformer/support/rehype/rehype-add-attachments-images";

describe("rehypeAddAttachmentsImages", () => {
  it("should be defined", () => {
    expect(rehypeAddAttachmentsImages).toBeDefined();
  });

  it("should be return an empty images array", () => {
    // Arrange
    const markdown = dedent`
    <h1>Hello World</h1>
    `;

    // Act
    const file = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkFrontmatter)
      .use(remarkParseFrontmatter)
      .use(remarkRehype)
      .use(rehypeAddAttachmentsImages)
      .use(rehypeStringify)
      .processSync(markdown);

    // Assert
    expect(file.data.images).toEqual({});
  });

  it("should add attachments images with Images tag in images object", () => {
    // Arrange
    const html = dedent`
    <a href="./image.jpg"><img src="./image.jpg" alt="image.jpg"/></a>
    `;

    // Act
    const file = rehype().use(rehypeAddAttachmentsImages).processSync(html);

    // eslint-disable-next-line jest/no-conditional-in-test
    const base = file.dirname ? path.resolve(file.cwd, file.dirname) : file.cwd;

    // Assert
    expect(file.value).toContain('<img src="image.jpg" alt="image.jpg">');
    expect(file.data.images).toEqual({
      "image.jpg": path.resolve(base, "./image.jpg"),
    });
  });

  it("should add attachments images without link", () => {
    // Arrange
    const html = dedent`
    <a href="./image.jpg"><img src="./image.jpg" alt="image.jpg"/></a>
    <img src="./image-2.jpg" alt="image-2.jpg"/>
    `;

    // Act
    const file = rehype().use(rehypeAddAttachmentsImages).processSync(html);

    // eslint-disable-next-line jest/no-conditional-in-test
    const base = file.dirname ? path.resolve(file.cwd, file.dirname) : file.cwd;

    // Assert
    expect(file.value).toContain('<img src="image.jpg" alt="image.jpg">');
    expect(file.value).toContain('<img src="image-2.jpg" alt="image-2.jpg">');
    expect(file.data.images).toEqual({
      "image-2.jpg": path.resolve(base, "./image-2.jpg"),
      "image.jpg": path.resolve(base, "./image.jpg"),
    });
  });

  it("dirname property in output files should be equal to provided dirname parameter", () => {
    // Arrange
    const html = dedent`
    <a href="./image.jpg"><img src="./image.jpg" alt="image.jpg"/></a>
    <img src="./image-2.jpg" alt="image-2.jpg"/>
    `;

    // Act
    const file = rehype()
      .use(rehypeAddAttachmentsImages)
      .processSync(toVFile({ dirname: "images", path: "img", value: html }));

    // Assert
    expect(file.dirname).toBe("images");
  });
});
