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
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-child2-id",
    title: "foo-child2-title",
    content: "foo-child2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild1-id",
    title: "foo-grandChild1-title",
    content: "foo-grandChild1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "foo-child1-title" },
    ],
  },
  {
    id: "foo-grandChild2-id",
    title: "foo-grandChild2-title",
    content: "foo-grandChild2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "foo-child1-title" },
    ],
  },
  {
    id: "foo-grandChild3-id",
    title: "foo-grandChild3-title",
    content: "foo-grandChild3-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child2-id", title: "foo-child2-title" },
    ],
  },
  {
    id: "foo-grandChild4-id",
    title: "foo-grandChild4-title",
    content: "foo-grandChild4-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child2-id", title: "foo-child2-title" },
    ],
  },
  {
    id: "foo-child3-id",
    title: "foo-child3-title",
    content: "foo-child3-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild5-id",
    title: "foo-grandChild5-title",
    content: "foo-grandChild5-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child3-id", title: "foo-child3-title" },
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
      page: { results: [{ id: "foo-child1-id", title: "foo-child1-title" }] },
    },
  },
  {
    id: "foo-child1-id",
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
    children: {
      page: {
        results: [
          { id: "foo-grandChild1-id", title: "foo-grandChild1-title" },
          { id: "foo-grandChild2-id", title: "foo-grandChild2-title" },
        ],
      },
    },
  },
  {
    id: "foo-grandChild1-id",
    title: "foo-grandChild1-title",
    content: "foo-grandChild1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "foo-child1-title" },
    ],
  },
  {
    id: "foo-grandChild2-id",
    title: "foo-grandChild2-title",
    content: "foo-grandChild2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "foo-child1-title" },
    ],
  },
];

export const PAGES_DEFAULT_ROOT_CREATE = [
  {
    id: "foo-child2-id",
    title: "foo-child2-title",
    content: "foo-child2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-child3-id",
    title: "foo-child3-title",
    content: "foo-child3-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild3-id",
    title: "foo-grandChild3-title",
    content: "foo-grandChild3-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child2-id", title: "foo-child2-title" },
    ],
  },
  {
    id: "foo-grandChild4-id",
    title: "foo-grandChild4-title",
    content: "foo-grandChild4-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child2-id", title: "foo-child2-title" },
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
    title: "foo-child1-title",
    content: "foo-child1-content",
    version: { number: 2 },
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
  },
  {
    id: "foo-grandChild1-id",
    title: "foo-grandChild1-title",
    content: "foo-grandChild1-content",
    version: { number: 2 },
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "foo-child1-title" },
    ],
  },
];

export const PAGES_DEFAULT_ROOT_DELETE = [
  {
    id: "foo-grandChild1-id",
    title: "foo-grandChild1-title",
  },
  {
    id: "foo-grandChild2-id",
    title: "foo-grandChild2-title",
  },
  {
    id: "foo-grandChild1-attachment-id",
    title: "foo-grandChild1-attachment-title",
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
  {
    id: "foo-grandChild3-id",
    attachments: {
      results: [],
    },
  },
];

export const PAGES_FLAT_MODE = [
  {
    id: "foo-root-id",
    title: "foo-root-title",
    content: "foo-root-content",
    version: { number: 1 },
    children: {
      page: {
        results: [
          { id: "foo-page-1-id", title: "foo-page-1-title" },
          { id: "foo-page-2-id", title: "foo-page-2-title" },
        ],
      },
    },
  },
  {
    id: "foo-page-1-id",
    title: "foo-page-1-title",
    content: "foo-page-1-content",
    version: { number: 1 },
  },
  {
    id: "foo-page-2-id",
    title: "foo-page-2-title",
    content: "foo-page-2-content",
    version: { number: 1 },
  },
  {
    id: "foo-page-3-id",
    title: "foo-page-3-title",
    content: "foo-page-3-content",
    version: { number: 1 },
  },
];

export const ATTACHMENTS_FLAT_MODE = [
  {
    id: "foo-page-1-id",
    attachments: {
      results: [],
    },
  },
  {
    id: "foo-page-2-id",
    attachments: {
      results: [],
    },
  },
  {
    id: "foo-page-3-id",
    attachments: {
      results: [],
    },
  },
];

export const RENAMED_PAGE = [
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
      page: { results: [{ id: "foo-child1-id", title: "foo-child1-title" }] },
    },
  },
  {
    id: "foo-child1-id",
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
    ],
    children: {
      page: {
        results: [
          { id: "foo-grandChild1-id", title: "foo-grandChild1-title" },
          { id: "foo-grandChild2-id", title: "foo-grandChild2-title" },
        ],
      },
    },
  },
  {
    id: "foo-grandChild1-id",
    title: "foo-grandChild1-title",
    content: "foo-grandChild1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "foo-child1-title" },
    ],
  },
  {
    id: "foo-grandChild2-id",
    title: "foo-grandChild2-title",
    content: "foo-grandChild2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-parent-id", title: "foo-parent-title" },
      { id: "foo-child1-id", title: "foo-child1-title" },
    ],
  },
];

export const RENAMED_PAGE_CREATE = [
  {
    id: "foo-renamed-id",
    title: "foo-renamed-title",
    content: "foo-parent-content",
    ancestors: [{ id: "foo-root-id", title: "foo-root-title" }],
  },
  {
    id: "foo-child1-id",
    title: "foo-child1-title",
    content: "foo-child1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-renamed-id", title: "foo-renamed-title" },
    ],
  },
  {
    id: "foo-grandChild1-id",
    title: "foo-grandChild1-title",
    content: "foo-grandChild1-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-renamed-id", title: "foo-renamed-title" },
      { id: "foo-child1-id", title: "foo-child1-title" },
    ],
  },
  {
    id: "foo-grandChild2-id",
    title: "foo-grandChild2-title",
    content: "foo-grandChild2-content",
    ancestors: [
      { id: "foo-root-id", title: "foo-root-title" },
      { id: "foo-renamed-id", title: "foo-renamed-title" },
      { id: "foo-child1-id", title: "foo-child1-title" },
    ],
  },
];

export const RENAMED_PAGE_ATTACHMENTS = [
  {
    id: "foo-renamed-id",
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
      results: [],
    },
  },
  {
    id: "foo-grandChild2-id",
    attachments: {
      results: [],
    },
  },
];
