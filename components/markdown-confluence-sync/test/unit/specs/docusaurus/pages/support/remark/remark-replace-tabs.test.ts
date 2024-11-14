import { remark } from "remark";
import remarkMdx from "remark-mdx";
import { dedent } from "ts-dedent";

import { InvalidTabItemMissingLabelError } from "@src/lib/docusaurus/pages/errors/InvalidTabItemMissingLabelError";
import { InvalidTabsFormatError } from "@src/lib/docusaurus/pages/errors/InvalidTabsFormatError";
import remarkReplaceTabs from "@src/lib/docusaurus/pages/support/remark/remark-replace-tabs";

describe("remarkReplaceTabs", () => {
  it("should be defined", () => {
    expect(remarkReplaceTabs).toBeDefined();
  });

  it("should replace tabs", () => {
    // Arrange
    const tabs = `
<Tabs>
<TabItem value="file-tree" label="File tree" default>
Tab Item Content
</TabItem>
</Tabs>
`;

    // Act
    const file = remark()
      .use(remarkMdx)
      .use(remarkReplaceTabs)
      .processSync(tabs);

    // Assert
    expect(file.toString()).toContain(dedent`*   File tree
    
        Tab Item Content`);
  });

  it("should throw InvalidTabsFormatError when Tabs tag does not have only TabItem children", () => {
    // Arrange
    const tabs = `
<Tabs>
<TabItem value="file-tree" label="File tree" default>
Tab Item Content
</TabItem>
<OtherTag />
</Tabs>
`;

    // Act
    expect(() => {
      remark().use(remarkMdx).use(remarkReplaceTabs).processSync(tabs);
    }).toThrow(new InvalidTabsFormatError());
  });

  it("should throw InvalidTabsFormatError when TabItem tag does not have a label property", () => {
    // Arrange
    const tabs = `
<Tabs>
<TabItem value="file-tree" default>
Tab Item Content
</TabItem>
</Tabs>
`;

    // Act
    expect(() => {
      remark().use(remarkMdx).use(remarkReplaceTabs).processSync(tabs);
    }).toThrow(new InvalidTabItemMissingLabelError());
  });

  it("should replace tabs with nested tabs", () => {
    // Arrange
    const tabs = `
<Tabs>
<TabItem value="file-tree" label="File tree" default>
Tab Item Content
<Tabs>
<TabItem value="file-tree" label="File tree" default>
Tab Inside
</TabItem>
</Tabs>
</TabItem>
<TabItem value="file-tree" label="File tree 2" default>
Tab Item Content 2
</TabItem>
</Tabs>
`;

    // Act
    const file = remark()
      .use(remarkMdx)
      .use(remarkReplaceTabs)
      .processSync(tabs);

    // Assert
    expect(file.toString()).toContain(dedent`*   File tree
    
        Tab Item Content

        *   File tree

            Tab Inside

    *   File tree 2

        Tab Item Content 2`);
  });
});
