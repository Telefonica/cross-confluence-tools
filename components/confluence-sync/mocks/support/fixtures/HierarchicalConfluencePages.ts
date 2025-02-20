// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export const PAGES_EMPTY_ROOT = [
  {
    id: "foo-root-id",
    title: "foo-root-title",
    content: "foo-root-content",
    ancestors: [],
    children: [],
  },
  {
    id: "foo-parent-id",
    title: "foo-parent-title",
    content: "foo-parent-content",
    ancestors: [{ id: "foo-root-id", title: "foo-root-title" }],
  },
  {
    id: "foo-child1-id",
    title: "[foo-parent-title] foo-child1-title",
    content: "foo-child1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-child2-id",
    title: "[foo-parent-title] foo-child2-title",
    content: "foo-child2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild1-id",
    title: "[foo-parent-title][foo-child1-title] foo-grandChild1-title",
    content: "foo-grandChild1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "[foo-parent-title] foo-child1-title" },
    ],
  },
  {
    id: "foo-grandChild2-id",
    title: "[foo-parent-title][foo-child1-title] foo-grandChild2-title",
    content: "foo-grandChild2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "[foo-parent-title] foo-child1-title" },
    ],
  },
  {
    id: "foo-grandChild3-id",
    title: "[foo-parent-title][foo-child2-title] foo-grandChild3-title",
    content: "foo-grandChild3-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child2-id", title: "[foo-parent-title] foo-child2-title" },
    ],
  },
  {
    id: "foo-grandChild4-id",
    title: "[foo-parent-title][foo-child2-title] foo-grandChild4-title",
    content: "foo-grandChild4-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child2-id", title: "[foo-parent-title] foo-child2-title" },
    ],
  },
  {
    id: "foo-child3-id",
    title: "[foo-parent-title] foo-child3-title",
    content: "foo-child3-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild5-id",
    title: "[foo-parent-title][foo-child3-title] foo-grandChild5-title",
    content: "foo-grandChild5-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child3-id", title: "[foo-parent-title] foo-child3-title" },
    ],
  },
];

export const PAGES_DEFAULT_ROOT_GET = [
  {
    id: "foo-root-id",
    title: "foo-root-title",
    content: "foo-root-content",
    ancestors: [],
    children: {
      page: { results: [{ id: "foo-parent-id", title: "foo-parent-title" }] },
    },
  },
  {
    id: "foo-parent-id",
    title: "foo-parent-title",
    content: "foo-parent-content",
    ancestors: [{ id: "foo-root-id", title: "foo-root-title" }],
    children: {
      page: {
        results: [
          { id: "foo-child1-id", title: "[foo-parent-title] foo-child1-title" },
        ],
      },
    },
  },
  {
    id: "foo-child1-id",
    title: "[foo-parent-title] foo-child1-title",
    content: "foo-child1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
    children: {
      page: {
        results: [
          {
            id: "foo-grandChild1-id",
            title: "[foo-parent-title][foo-child1-title] foo-grandChild1-title",
          },
          {
            id: "foo-grandChild2-id",
            title: "[foo-parent-title][foo-child1-title] foo-grandChild2-title",
          },
        ],
      },
    },
  },
  {
    id: "foo-grandChild1-id",
    title: "[foo-parent-title][foo-child1-title] foo-grandChild1-title",
    content: "foo-grandChild1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "[foo-parent-title] foo-child1-title" },
    ],
  },
  {
    id: "foo-grandChild2-id",
    title: "[foo-parent-title][foo-child1-title] foo-grandChild2-title",
    content: "foo-grandChild2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "[foo-parent-title] foo-child1-title" },
    ],
  },
];

export const PAGES_DEFAULT_ROOT_CREATE = [
  {
    id: "foo-child2-id",
    title: "[foo-parent-title] foo-child2-title",
    content: "foo-child2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-child3-id",
    title: "[foo-parent-title] foo-child3-title",
    content: "foo-child3-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild3-id",
    title: "[foo-parent-title][foo-child2-title] foo-grandChild3-title",
    content: "foo-grandChild3-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child2-id", title: "[foo-parent-title] foo-child2-title" },
    ],
  },
  {
    id: "foo-grandChild4-id",
    title: "[foo-parent-title][foo-child2-title] foo-grandChild4-title",
    content: "foo-grandChild4-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child2-id", title: "[foo-parent-title] foo-child2-title" },
    ],
  },
];

export const PAGES_DEFAULT_ROOT_UPDATE = [
  {
    id: "foo-parent-id",
    title: "foo-parent-title",
    content: "foo-parent-content",
    version: { number: 2 },
    ancestors: [{ id: "foo-root-id", title: "foo-root-title" }],
  },
  {
    id: "foo-child1-id",
    title: "[foo-parent-title] foo-child1-title",
    content: "foo-child1-content",
    version: { number: 2 },
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild1-id",
    title: "[foo-parent-title][foo-child1-title] foo-grandChild1-title",
    content: "foo-grandChild1-content",
    version: { number: 2 },
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "[foo-parent-title] foo-child1-title" },
    ],
  },
];

export const PAGES_DEFAULT_ROOT_DELETE = [
  {
    id: "foo-child1-id",
    title: "[foo-parent-title] foo-child1-title",
  },
  {
    id: "foo-grandChild1-id",
    title: "[foo-parent-title][foo-child1-title] foo-grandChild1-title",
  },
  {
    id: "foo-grandChild2-id",
    title: "[foo-parent-title][foo-child1-title] foo-grandChild2-title",
  },
];
