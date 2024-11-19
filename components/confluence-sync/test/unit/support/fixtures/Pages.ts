// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  ConfluencePage,
  ConfluencePageBasicInfo,
} from "@src/confluence/types";
import type { ConfluenceInputPage } from "@src/ConfluenceSyncPages.types";

export function createConfluencePage(options: {
  name: string;
  children?: ConfluencePageBasicInfo[];
  ancestors?: ConfluencePageBasicInfo[];
}): ConfluencePage {
  const basePage = {
    id: `foo-${options.name}-id`,
    title: `foo-${options.name}-title`,
    version: 1,
    content: `foo-${options.name}-content`,
    children: options?.children,
    ancestors: options?.ancestors,
  };

  return basePage;
}

export function createInputPage(options: {
  name: string;
  ancestors?: string[];
}): ConfluenceInputPage {
  const inputPage = {
    title: `foo-${options.name}-title`,
    content: `foo-${options.name}-content`,
    ancestors: options?.ancestors,
  };

  return inputPage;
}

export function createTree(): ConfluencePage[] {
  const parentPage = createConfluencePage({ name: "parent" });
  const childPage1 = createConfluencePage({
    name: "child1",
    ancestors: [convertToPageBasicInfo(parentPage)],
  });
  const childPage2 = createConfluencePage({
    name: "child2",
    ancestors: [convertToPageBasicInfo(parentPage)],
  });
  const grandChildPage1 = createConfluencePage({
    name: "grandChild1",
    ancestors: [
      convertToPageBasicInfo(parentPage),
      convertToPageBasicInfo(childPage1),
    ],
  });
  const grandChildPage2 = createConfluencePage({
    name: "grandChild2",
    ancestors: [
      convertToPageBasicInfo(parentPage),
      convertToPageBasicInfo(childPage1),
    ],
  });
  const grandChildPage3 = createConfluencePage({
    name: "grandChild3",
    ancestors: [
      convertToPageBasicInfo(parentPage),
      convertToPageBasicInfo(childPage2),
    ],
  });
  const grandChildPage4 = createConfluencePage({
    name: "grandChild4",
    ancestors: [
      convertToPageBasicInfo(parentPage),
      convertToPageBasicInfo(childPage2),
    ],
  });

  childPage1.children = [
    convertToPageBasicInfo(grandChildPage1),
    convertToPageBasicInfo(grandChildPage2),
  ];
  childPage2.children = [
    convertToPageBasicInfo(grandChildPage3),
    convertToPageBasicInfo(grandChildPage4),
  ];
  parentPage.children = [
    convertToPageBasicInfo(childPage1),
    convertToPageBasicInfo(childPage2),
  ];

  return [
    parentPage,
    childPage1,
    childPage2,
    grandChildPage1,
    grandChildPage2,
    grandChildPage3,
    grandChildPage4,
  ];
}

export function createInputTree(): ConfluenceInputPage[] {
  const parentPage = createInputPage({ name: "parent" });
  const childPage1 = createInputPage({
    name: "child1",
    ancestors: [parentPage.title],
  });
  const childPage2 = createInputPage({
    name: "child2",
    ancestors: [parentPage.title],
  });
  const grandChildPage1 = createInputPage({
    name: "grandChild1",
    ancestors: [parentPage.title, childPage1.title],
  });
  const grandChildPage2 = createInputPage({
    name: "grandChild2",
    ancestors: [parentPage.title, childPage1.title],
  });
  const grandChildPage3 = createInputPage({
    name: "grandChild3",
    ancestors: [parentPage.title, childPage2.title],
  });
  const grandChildPage4 = createInputPage({
    name: "grandChild4",
    ancestors: [parentPage.title, childPage2.title],
  });

  return [
    parentPage,
    childPage1,
    childPage2,
    grandChildPage1,
    grandChildPage2,
    grandChildPage3,
    grandChildPage4,
  ];
}

export function createChildPage(
  parent: ConfluenceInputPage,
  name: string,
): ConfluenceInputPage {
  const parentAncestors = parent.ancestors || [];
  const childPage = createInputPage({
    name,
    ancestors: [...parentAncestors, parent.title],
  });

  return childPage;
}

export function createAttachments(
  page: ConfluenceInputPage,
  count: number,
): ConfluenceInputPage {
  const attachments: Record<string, string> = {};
  for (let i = 0; i < count; i++) {
    attachments[`${page.title}-attachment-${i}`] =
      `${page.title}-path-to-attachment-${i}`;
  }
  return { ...page, attachments };
}

function convertToPageBasicInfo(page: ConfluencePage): ConfluencePageBasicInfo {
  return {
    id: page.id,
    title: page.title,
  };
}

export function convertPagesAncestorsToConfluenceAncestors(
  page: ConfluenceInputPage,
  confluenceTree: ConfluencePage[],
) {
  const pageAncestors = page.ancestors || [];
  return pageAncestors.slice(1).map((ancestor, i) => {
    return { id: confluenceTree[i].id, title: ancestor };
  });
}
