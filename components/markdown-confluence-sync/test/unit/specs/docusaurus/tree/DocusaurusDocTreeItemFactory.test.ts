// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { writeFileSync } from "fs";

import type { DirResult } from "tmp";
import { dedent } from "ts-dedent";

import { TempFiles } from "@support/utils/TempFiles";
const { dirSync, fileSync } = new TempFiles();

import { DocusaurusDocItemFactory } from "@src/lib/docusaurus/tree/DocusaurusDocItemFactory";
import { DocusaurusDocTreeCategory } from "@src/lib/docusaurus/tree/DocusaurusDocTreeCategory";
import { DocusaurusDocTreePage } from "@src/lib/docusaurus/tree/DocusaurusDocTreePage";
import { DocusaurusDocTreePageMdx } from "@src/lib/docusaurus/tree/DocusaurusDocTreePageMdx";

describe("docusaurusDocTreeItemFactory", () => {
  let dir: DirResult;
  let options: { cwd: string };

  beforeEach(() => {
    dir = dirSync({ unsafeCleanup: true });
    options = { cwd: process.cwd() };
  });

  afterEach(() => {
    dir.removeCallback();
  });

  it("should be defined", () => {
    expect(DocusaurusDocItemFactory).toBeDefined();
  });

  it("should return a DocusaurusDocTreeCategory when the path is a directory", () => {
    // Arrange
    const docsDir = dirSync({ dir: dir.name });
    const index = fileSync({ dir: docsDir.name, name: "index.md" });
    writeFileSync(
      index.name,
      dedent`
      ---
      title: Category
      ---

      # Hello World
      `,
    );

    // Act
    const result = DocusaurusDocItemFactory.fromPath(docsDir.name, options);

    // Assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(DocusaurusDocTreeCategory);
  });

  it("should return a DocusaurusDocTreePage when the path is a file", () => {
    // Arrange
    const file = fileSync({ dir: dir.name, postfix: ".md" });
    writeFileSync(
      file.name,
      dedent`
      ---
      title: Hello World
      ---

      # Hello World
      `,
    );

    // Act
    const result = DocusaurusDocItemFactory.fromPath(file.name, options);

    // Assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(DocusaurusDocTreePage);
  });

  it("should return a DocusaurusDocTreePageMdx when the path is a mdx file", () => {
    // Arrange
    const file = fileSync({ dir: dir.name, postfix: ".mdx" });
    writeFileSync(
      file.name,
      dedent`
      ---
      title: Hello World
      ---

      import Tabs from '@theme/Tabs';
      import TabItem from '@theme/TabItem';

      # Hello World
      :::note title
        Hello World
      :::      
      `,
    );

    // Act
    const result = DocusaurusDocItemFactory.fromPath(file.name, options);

    // Assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(DocusaurusDocTreePageMdx);
    expect(result.content).toContain(
      dedent(`---
      title: Hello World
      ---
      
      import Tabs from '@theme/Tabs';
      import TabItem from '@theme/TabItem';

      # Hello World

      > **Note: title**
      >
      > Hello World
    `),
    );
  });

  it("should return a DocusaurusDocTreePageMdx when the path is a mdx file and it's not index file", () => {
    // Arrange
    const file = fileSync({ dir: dir.name, name: "page.mdx" });
    writeFileSync(
      file.name,
      dedent`
---
title: Hello World
confluence_short_name: Page Mdx
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



<Tabs>
  <TabItem value="file-tree" label="File tree" default>
      Tab Item Content

:::note
  Hello World
:::
  
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
      `,
    );

    // Act
    const result = DocusaurusDocItemFactory.fromPath(file.name, options);

    // Assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(DocusaurusDocTreePageMdx);
    expect(result.content).toContain(
      dedent(`---
    title: Hello World
    confluence_short_name: Page Mdx
    ---
    
    import Tabs from '@theme/Tabs';
    import TabItem from '@theme/TabItem';
    
    *   File tree
    
        Tab Item Content
    
        > **Note:**
        >
        > Hello World

        *   File tree
    
            Tab Inside
    
    *   File tree 2
    
        Tab Item Content 2`),
    );
  });
});
