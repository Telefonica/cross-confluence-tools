import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { dedent } from "ts-dedent";

import remarkRemoveMdxCodeBlocks from "@src/lib/confluence/transformer/support/remark/remark-remove-mdx-code-blocks";

describe("remark-remove-mdx-code-blocks", () => {
  it("should be defined", () => {
    expect(remarkRemoveMdxCodeBlocks).toBeDefined();
  });

  it("should remove mdx-code-block", () => {
    // Arrange
    const mdxCodeBlock = dedent`
    \`\`\`mdx-code-block
        <h1>Hello World</h1>
    \`\`\`
    `;
    const input = dedent`
    This is a paragraph with mdx code block
    ${mdxCodeBlock}
    `;

    // Act
    const actual = remark()
      .use(remarkGfm)
      .use(remarkRemoveMdxCodeBlocks)
      .processSync(input)
      .toString();

    // Assert
    expect(actual).toContain(`This is a paragraph with mdx code block`);
    expect(actual).not.toContain(`Code block test`);
  });
});
