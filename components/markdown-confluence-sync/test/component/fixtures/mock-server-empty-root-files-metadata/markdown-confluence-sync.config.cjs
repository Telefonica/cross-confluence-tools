// SPDX-FileCopyrightText: 2025 Telefónica Innovación Digital
// SPDX-License-Identifier: MIT

module.exports = {
  logLevel: "info",
  filesMetadata: [
    {
      path: "docs/parent/index.md",
      id: "foo-parent",
      title: "foo-parent-title",
      sync: true,
    },
    {
      path: "docs/parent/child1/grandChild1.md",
      id: "foo-grandChild1",
      title: "foo-grandChild1-title",
      sync: true,
    },
    {
      path: "docs/parent/child1/grandChild2.md",
      id: "foo-grandChild2",
      title: "foo-grandChild2-title",
      sync: true,
    },
    {
      path: "docs/parent/child1/index.md",
      id: "foo-child1",
      title: "foo-child1-title",
      sync: true,
    },
    {
      path: "docs/parent/child2/grandChild3.md",
      id: "foo-grandChild3",
      title: "foo-grandChild3-title",
      sync: true,
    },
    {
      path: "docs/parent/child2/grandChild4.md",
      id: "foo-grandChild4",
      title: "foo-grandChild4-title",
      sync: true,
    },
    {
      path: "docs/parent/child2/index.md",
      id: "foo-child2",
      title: "foo-child2-title",
      sync: true,
    },
    {
      path: "docs/parent/child3/grandChild5.md",
      id: "foo-grandChild5",
      title: "foo-grandChild5-title",
      sync: true,
    },
    {
      path: "docs/parent/child4/grandChild6.md",
      id: "foo-grandChild6",
      title: "foo-grandChild6-title",
      shortName: "grandchild6",
      sync: true,
    },
    {
      path: "docs/parent/child4/grandChild7.md",
      id: "foo-grandChild7",
      title: "foo-grandChild7-title",
      sync: true,
    },
    {
      path: "docs/parent/child4/index.md",
      id: "foo-child4",
      title: "foo-child4-title",
      shortName: "child4",
      sync: true,
    },
    {
      path: "docs/parent/child5/grandChild8.md",
      id: "foo-grandChild8",
      title: "foo-grandChild8-title",
      sync: true,
    },
    {
      path: "docs/parent/child5/index.md",
      id: "foo-child5",
      title: "foo-child5-title",
      shortName: "child5",
      sync: true,
    },
    {
      path: "docs/parent/child6/grandChild9/greatGrandChild1.md",
      id: "foo-greatGrandChild1",
      title: "foo-greatGrandChild-title",
      sync: true,
    },
    {
      path: "docs/parent/child6/grandChild10/greatGrandChild2.md",
      id: "foo-greatGrandChild2",
      title: "foo-greatGrandChild-title",
      sync: true,
    },
  ],
  confluence: {
    url: "http://127.0.0.1:3100",
    personalAccessToken: "foo-token",
    spaceKey: "foo-space-id",
    rootPageId: "foo-root-id",
  },
};
