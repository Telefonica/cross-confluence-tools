// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { ConfluenceInputPage } from "@src/index";

export const pagesNoRoot: ConfluenceInputPage[] = [
  {
    title: "foo-parent-title",
    content: "foo-parent-content",
    ancestors: [],
  },
  {
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: ["foo-parent-title"],
  },
  {
    title: "foo-child2-title",
    content: "foo-child2-content",
    ancestors: ["foo-parent-title"],
  },
  {
    title: "foo-grandChild1-title",
    content: "foo-grandChild1-content",
    ancestors: ["foo-parent-title", "foo-child1-title"],
  },
  {
    title: "foo-grandChild2-title",
    content: "foo-grandChild2-content",
    ancestors: ["foo-parent-title", "foo-child1-title"],
  },
  {
    title: "foo-grandChild3-title",
    content: "foo-grandChild3-content",
    ancestors: ["foo-parent-title", "foo-child2-title"],
  },
  {
    title: "foo-grandChild4-title",
    content: "foo-grandChild4-content",
    ancestors: ["foo-parent-title", "foo-child2-title"],
  },
];

export const pagesWithRoot: ConfluenceInputPage[] = [
  {
    title: "foo-parent-title",
    content: "foo-parent-content",
    ancestors: ["foo-root-title"],
  },
  {
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: ["foo-root-title", "foo-parent-title"],
  },
  {
    title: "foo-child2-title",
    content: "foo-child2-content",
    ancestors: ["foo-root-title", "foo-parent-title"],
  },
  {
    title: "foo-grandChild1-title",
    content: "foo-grandChild1-content",
    ancestors: ["foo-root-title", "foo-parent-title", "foo-child1-title"],
  },
  {
    title: "foo-grandChild3-title",
    content: "foo-grandChild3-content",
    ancestors: ["foo-root-title", "foo-parent-title", "foo-child2-title"],
    attachments: {
      "foo-grandChild3-attachment1-title":
        "test/component/support/fixtures/image.png",
    },
  },
  {
    title: "foo-grandChild4-title",
    content: "foo-grandChild4-content",
    ancestors: ["foo-root-title", "foo-parent-title", "foo-child2-title"],
  },
];

export const wrongPages: ConfluenceInputPage[] = [
  {
    title: "foo-parent-title",
    content: "foo-parent-content",
    ancestors: ["foo-root-title"],
  },
  {
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: ["foo-root-title", "foo-parent-title"],
  },
  {
    title: "foo-wrongPage-title",
    content: "foo-wrongPage-content",
    ancestors: ["foo-root-title", "foo-parent-title", "foo-inexistent-title"],
  },
];

export const createWrongPages: ConfluenceInputPage[] = [
  {
    title: "foo-parent-title",
    content: "foo-parent-content",
    ancestors: ["foo-root-title"],
  },
  {
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: ["foo-root-title", "foo-parent-title"],
  },
  {
    title: "foo-wrongPage-title",
    content: "This page returns a 400 error when creating",
    ancestors: ["foo-root-title", "foo-parent-title"],
  },
  {
    title: "foo-child2-title",
    content: "foo-child2-content",
    ancestors: ["foo-root-title", "foo-parent-title"],
  },
  {
    title: "foo-grandChild3-title",
    content: "foo-grandChild3-content",
    ancestors: ["foo-root-title", "foo-parent-title", "foo-child2-title"],
  },
];

export const updateWrongPages: ConfluenceInputPage[] = [
  {
    title: "foo-parent-title",
    content: "foo-parent-content",
    ancestors: ["foo-root-title"],
  },
  {
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: ["foo-root-title", "foo-parent-title"],
  },
  {
    title: "foo-child2-title",
    content: "foo-child2-content",
    ancestors: ["foo-root-title", "foo-parent-title"],
  },
  {
    title: "foo-grandChild3-title",
    content: "foo-grandChild3-content",
    ancestors: ["foo-root-title", "foo-parent-title", "foo-child2-title"],
  },
  {
    title: "foo-grandChild2-title",
    content: "This page returns a 400 error when updating",
    ancestors: ["foo-root-title", "foo-parent-title", "foo-child1-title"],
  },
];

export const deleteWrongPages: ConfluenceInputPage[] = [
  {
    title: "foo-parent-title",
    content: "foo-parent-content",
    ancestors: ["foo-root-title"],
  },
  {
    title: "foo-child2-title",
    content: "foo-child2-content",
    ancestors: ["foo-root-title", "foo-parent-title"],
  },
  {
    title: "foo-grandChild3-title",
    content: "foo-grandChild3-content",
    ancestors: ["foo-root-title", "foo-parent-title", "foo-child2-title"],
  },
  // when deleting child1 it will return a 400 error
];

export const flatPages: ConfluenceInputPage[] = [
  {
    title: "foo-page-1-title",
    content: "foo-page-1-content",
    id: "foo-page-1-id",
  },
  {
    title: "foo-page-2-title",
    content: "foo-page-2-content",
    id: "foo-page-2-id",
  },
  {
    title: "foo-page-3-title",
    content: "foo-page-3-content",
  },
];

export const flatPagesWithRoot: ConfluenceInputPage[] = [
  {
    id: "foo-page-1-id",
    title: "foo-page-1-title",
    content: "foo-page-1-content",
  },
  {
    title: "foo-page-3-title",
    content: "foo-page-3-content",
  },
];

export const renamedPage: ConfluenceInputPage[] = [
  {
    title: "foo-renamed-title",
    content: "foo-parent-content",
    ancestors: ["foo-root-title"],
  },
  {
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: ["foo-root-title", "foo-renamed-title"],
  },
  {
    title: "foo-grandChild1-title",
    content: "foo-grandChild1-content",
    ancestors: ["foo-root-title", "foo-renamed-title", "foo-child1-title"],
  },
  {
    title: "foo-grandChild2-title",
    content: "foo-grandChild2-content",
    ancestors: ["foo-root-title", "foo-renamed-title", "foo-child1-title"],
  },
];
