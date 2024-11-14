import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

import rehypeReplaceDetails from "@src/lib/confluence/transformer/support/rehype/rehype-replace-details";

describe("rehype-replace-details", () => {
  it("should be defined", () => {
    expect(rehypeReplaceDetails).toBeDefined();
  });

  it("should replace <details> with Confluence expand macro", () => {
    // Arrange
    const html = "<details><summary>Greetings</summary>Hi</details>";

    // Act & Assert
    expect(
      unified()
        .use(rehypeParse)
        .use(rehypeStringify)
        .use(rehypeReplaceDetails)
        .processSync(html)
        .toString(),
    ).toContain(
      '<ac:structured-macro ac:name="expand"><ac:parameter ac:name="title">Greetings</ac:parameter><ac:rich-text-body><p>Hi</p></ac:rich-text-body></ac:structured-macro>',
    );
  });

  it("should throw an error if <details> tag does not have a <summary> tag", () => {
    // Arrange
    const html = "<details>Hi</details>";

    // Act & Assert
    expect(() =>
      unified()
        .use(rehypeParse)
        .use(rehypeStringify)
        .use(rehypeReplaceDetails)
        .processSync(html),
    ).toThrow("Invalid details tag. The details tag must have a summary tag.");
  });

  it("should replace <details> with Confluence expand macro with nested tags", () => {
    // Arrange
    const html =
      "<details><summary>Greetings</summary><details><summary>Hi</summary>World</details>World</details>";

    // Act & Assert
    expect(
      unified()
        .use(rehypeParse)
        .use(rehypeStringify)
        .use(rehypeReplaceDetails)
        .processSync(html)
        .toString(),
    ).toContain(
      '<ac:structured-macro ac:name="expand"><ac:parameter ac:name="title">Greetings</ac:parameter><ac:rich-text-body><ac:structured-macro ac:name="expand"><ac:parameter ac:name="title">Hi</ac:parameter><ac:rich-text-body><p>World</p></ac:rich-text-body></ac:structured-macro><p>World</p></ac:rich-text-body></ac:structured-macro>',
    );
  });

  it("should do nothing to other tags", () => {
    // Arrange
    const html = "<p>paragraph</p>";

    // Act & Assert
    expect(
      unified()
        .use(rehypeParse)
        .use(rehypeStringify)
        .use(rehypeReplaceDetails)
        .processSync(html)
        .toString(),
    ).toContain("<p>paragraph</p>");
  });
});
