// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { remark } from "remark";
import remarkMdx from "remark-mdx";
import { dedent } from "ts-dedent";

import remarkRemoveMdxCode from "@src/lib/docusaurus/pages/support/remark/remark-remove-mdx-code";
import remarkTransformDetails from "@src/lib/docusaurus/pages/support/remark/remark-transform-details";

describe("remarkTransformDetails", () => {
  it("should be defined", () => {
    expect(remarkTransformDetails).toBeDefined();
  });

  it("should prevent details tags from being removed", () => {
    // Arrange
    const details = `  
  This block should be removed

  <Tabs>
    <TabItem value="1" label="Tab 1">
      Tab 1 Content
    </TabItem>
    <TabItem value="2" label="Tab 2">
      Tab 2 Content
    </TabItem>
  </Tabs>
  
  This block shouldn't be removed

  <details>
    <summary>Details title</summary>
    Details Content
  </details>
  `;

    // Act
    const file = remark()
      .use(remarkMdx)
      .use(remarkTransformDetails)
      .use(remarkRemoveMdxCode)
      .processSync(details);

    // Assert
    expect(file.toString()).toContain(dedent`This block should be removed

  This block shouldn't be removed

  <details>
    <summary>Details title</summary>
    Details Content
  </details>`);
  });
});
