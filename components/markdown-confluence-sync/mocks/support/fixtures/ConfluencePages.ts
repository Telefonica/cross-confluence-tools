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
  {
    id: "foo-child4-id",
    title: "[foo-parent-title] foo-child4-title",
    content: "foo-child4-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild6-id",
    title: "[foo-parent-title][child4] foo-grandChild6-title",
    content: "foo-grandChild6-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child4-id", title: "[foo-parent-title] foo-child4-title" },
    ],
  },
  {
    id: "foo-grandChild7-id",
    title: "[foo-parent-title][child4] foo-grandChild7-title",
    content: "foo-grandChild7-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child4-id", title: "[foo-parent-title] foo-child4-title" },
    ],
  },
  {
    id: "foo-child5-id",
    title: "[foo-parent-title] foo-child5-title",
    content: "foo-child5-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild8-id",
    title: "[foo-parent-title][child5] foo-grandChild8-title",
    content: "foo-grandChild8-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child5-id", title: "[foo-parent-title] foo-child5-title" },
    ],
  },
  {
    id: "foo-child6-id",
    title: "[foo-parent-title] foo-child6-title",
    content: "",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild9-id",
    title: "[foo-parent-title][foo-child6-title] foo-grandChild9-title",
    content: "",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child6-id", title: "[foo-parent-title] foo-child6-title" },
    ],
  },
  {
    id: "foo-greatGrandChild1-id",
    title:
      "[foo-parent-title][foo-child6-title][foo-grandChild9-title] foo-greatGrandChild-title",
    content: "foo-greatGrandChild1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child6-id", title: "[foo-parent-title] foo-child6-title" },
      {
        id: "foo-grandChild9-id",
        title: "[foo-parent-title][foo-child6-title] foo-grandChild9-title",
      },
    ],
  },
  {
    id: "foo-grandChild10-id",
    title: "[foo-parent-title][foo-child6-title] foo-grandChild10-title",
    content: "",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child6-id", title: "[foo-parent-title] foo-child6-title" },
    ],
  },
  {
    id: "foo-greatGrandChild2-id",
    title:
      "[foo-parent-title][foo-child6-title][foo-grandChild10-title] foo-greatGrandChild-title",
    content: "foo-greatGrandChild2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child6-id", title: "[foo-parent-title] foo-child6-title" },
      {
        id: "foo-grandChild10-id",
        title: "[foo-parent-title][foo-child6-title] foo-grandChild10-title",
      },
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
  {
    id: "foo-grandChild1-attachment-id",
    title: "foo-grandChild1-attachment-title",
  },
];

export const PAGES_WITH_ROOT_PAGE_NAME = [
  {
    id: "foo-root-id",
    title: "foo-root-title",
    content: "foo-root-content",
    ancestors: [],
    children: [],
  },
  {
    id: "foo-parent-id",
    title: "[foo-root-name] foo-parent-title",
    content: "foo-parent-content",
    ancestors: [{ id: "foo-root-id", title: "foo-root-title" }],
  },
];

export const PAGES_WITH_MDX_FILES = [
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
];

export const ATTACHMENTS_DEFAULT_ROOT = [
  {
    id: "foo-parent-id",
    attachments: {
      results: [],
    },
  },
  {
    id: "foo-child1-id",
    attachments: {
      results: [],
    },
  },
  {
    id: "foo-grandChild1-id",
    attachments: {
      results: [
        {
          id: "foo-grandChild1-attachment-id",
          title: "foo-grandChild1-attachment-title",
        },
      ],
    },
  },
];

export const PAGES_WITH_CONFLUENCE_TITLE = [
  {
    id: "foo-root-id",
    title: "foo-root-title",
    content: "foo-root-content",
    ancestors: [],
    children: [],
  },
  {
    id: "foo-parent-id",
    title: "Confluence title",
  },
  {
    id: "foo-child1-id",
    title: "[Confluence title] foo-child1-title",
  },
  {
    id: "foo-grandChild1-id",
    title: "[Confluence title][foo-child1-title] Confluence grandChild 1",
  },
];

export const PAGES_WITH_ALTERNATIVE_INDEX_FILES = [
  {
    id: "foo-root-id",
    title: "foo-root-title",
    content: "foo-root-content",
    ancestors: [],
    children: [],
  },
  {
    id: "README-id",
    title: "README",
  },
  {
    id: "README-child-id",
    title: "[README] child",
  },
  {
    id: "README-mdx-id",
    title: "README-mdx",
  },
  {
    id: "README-child-mdx-id",
    title: "[README-mdx] child",
  },
  {
    id: "directory-name-id",
    title: "directory-name",
  },
  {
    id: "directory-name-child-id",
    title: "[directory-name] child",
  },
  {
    id: "directory-name-2-mdx-id",
    title: "directory-name-2-mdx",
  },
  {
    id: "directory-name-2-child-mdx-id",
    title: "[directory-name-2-mdx] child",
  },
  {
    id: "index-id.md",
    title: "index.md",
  },
  {
    id: "index.mdx-id",
    title: "index.mdx",
  },
];

export const PAGES_WITH_CONFLUENCE_PAGE_ID = [
  {
    id: "foo-root-id",
    title: "foo-root-title",
    content: "foo-root-content",
    ancestors: [],
  },
  {
    id: "foo-parent",
    title: "[FLAT] foo-parent-title",
    ancestors: [],
  },
  {
    id: "foo-child1",
    title: "[FLAT] foo-child1-title",
    ancestors: [],
  },
  {
    id: "foo-grandChild1",
    title: "[FLAT] foo-grandChild1-title",
    ancestors: [],
  },
  {
    id: "foo-grandChild2",
    title: "[FLAT] foo-grandChild2-title",
    ancestors: [],
  },
  {
    id: "foo-child-2-grandChild1",
    title: "[FLAT] foo-grandChild1-title",
    ancestors: [],
  },
  {
    id: "foo-child-2-child1-grandChild1",
    title: "[FLAT] foo-grandChild1-title",
    ancestors: [],
  },
];

export const PAGES_WITH_CONFLUENCE_PAGE_ID_ATTACHMENTS = [
  {
    id: "foo-child1",
    attachments: {
      results: [],
    },
  },
];
