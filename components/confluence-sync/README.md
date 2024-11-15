# confluence-sync-pages

Sync Confluence pages under a root page from a list of pages with their corresponding HTML contents. Supports nested pages and attachments upload. Also supports updating single pages with an id.

Read [Features](#features) for more information about the two sync modes available, "tree" and "flat".

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Example](#example)
- [Features](#features)
  - [Tree mode](#tree-mode)
  - [Flat mode](#flat-mode)
  - [Updating specific pages](#updating-specific-pages)
- [Attachments](#attachments)
- [How to get the root page id](#how-to-get-the-root-page-id)
- [Sync modes in detail](#sync-modes-in-detail)
  - [Tree](#tree-mode-1)
  - [Flat](#flat-mode-1)
  - [Updating specific pages](#updating-specific-pages-1)
- [API](#api)
  - [`ConfluenceSyncPages`](#confluencesyncpages)
  - [`sync`](#sync)

## Requirements

This library requires:

* A Confluence instance.
* The id of the Confluence space where the pages will be created.
* A personal access token to authenticate. You can create a personal access token following the instructions in the [Atlassian documentation](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/).

### Compatibility

> ![Warning]
> This library has been tested only with Confluence 8.5.x. It may work with other versions, but it has not been tested.

## Installation

```bash
npm install @tid-cross/confluence-sync
```

## Example

Import it and pass to it a list of pages to sync:

```js title="Example"
import { ConfluenceSyncPages } from '@tid-cross/confluence-sync';

const confluenceSyncPages = new ConfluenceSyncPages({
  url: "https://your.confluence.com",
  personalAccessToken: "*******",
  spaceId: "your-space-id",
  rootPageId: "12345678"
  logLevel: "debug",
  dryRun: false,
});

await confluenceSyncPages.sync([
  {
    title: 'Welcome to the documentation',
    content: 'This is the content of the page',
  },
  {
    title: 'Introduction to the documentation',
    content: 'This is the content of the page',
    ancestors: ['Welcome to the documentation'],
  },
  {
    title: 'How to get started',
    content: 'This is the content of the page',
    ancestors: ['Welcome to the documentation', 'Introduction to the documentation'],
    attachments: {
      'image.png': '/path/to/image.png',
    },
  }
]);
```

## Features

It is possible to use two different sync modes, `tree` and `flat`. And it also supports updating specific pages using their id in Confluence.

Every mode supports uploading attachments to the pages. The main differences between them are:

### Tree mode

In tree mode, the library receives an object defining a tree of Confluence pages, and it creates/deletes/updates the corresponding Confluence pages. All the pages are created under a __root page, which must be also provided__.

Note that the __root page must exist before running the sync process__, and that __all pages not present in the list will be deleted__.

* Creates Confluence pages from a list of pages with their corresponding paths, under a root page.
* Supports nested pages.
* Creates Confluence pages if they don't exist.
* Updates Confluence pages if they already exist.
* Deletes Confluence pages that are not present in the list.

> ![Warning]
> All pages not present in the list will be deleted.

### Flat mode

It is also possible to use a flat mode, where all pages will be always created under a root page, without nested levels. Differences from the tree mode are:

* Creates Confluence pages from a list of pages __always under the root page.__
* It __does not support nested pages__. So, all pages without id will be created/updated under the root page. So, the `ancestors` property is not supported in this mode.

### Updating specific pages

In flat mode, it is also possible to provide a Confluence id for each page. In this case, the library will always update the corresponding Confluence page with the id provided. __It may be under the root page or not__.

* The page must exist in Confluence before running the sync process.
* Passing an id __is only supported in flat mode.__

## Attachments

The library will create a new attachment if it doesn't exist, or delete it and create it again if it already exists.

When defining the attachments, you can use paths relative to the `process.cwd()` or absolute paths.

> ![Note]
> Deleting attachments that already exist in Confluence without uploading a new one to replace it is not supported.

## How to get the root page id

To get the ID of the root page, you can use the [Confluence REST API](https://developer.atlassian.com/cloud/confluence/rest/api-group-content/#api-api-content-get) or follow the next steps:

* Enter to Confluence.
* Go to the page of the space where you want to create the pages. 
* Click on the `...` button and select `Page information`.
* Copy the ID of the page from the URL. For example, if the URL is `https://confluence.tid.es/pages/viewpage.action?pageId=12345678`, the ID of the page is `12345678`. 

## Sync modes in detail

To get an idea of how the library works in each mode, please read the [features](#features) section. The following sections provide more details about each mode.

### Tree mode

This is the default mode of the library. It creates a tree of Confluence pages under a root page, following the hierarchy provided in the list of pages.

* The root page must exist before running the sync process.
* The library assumes that the __Confluence instance is using the default page hierarchy, where pages are organized in spaces__. It creates all the pages under a root page of the space.
* __The pages are identified by their title__. If a page with the same title already exists, it will be updated. If it doesn't exist, it will be created.
* The ancestors of each page should be ordered always from the root page to the page itself.
  * For example, if you want to create a page under the page `Introduction to the documentation`, which is under the page `Welcome to the documentation`, you should provide the following list of ancestors: `['Welcome to the documentation', 'Introduction to the documentation']`.
  * So, the first ancestor of each page must be the root page, if not, it will be added automatically.
* Updates Confluence pages if they already exist under the root page.
* __The pages under the root page that are not present in the list will be deleted.__
* __Updating the root page is not supported__.

### Flat mode

To enable the flat mode, you have to set the `syncMode` property of the configuration object to `flat`. Differences from the tree mode are:

* Creates Confluence pages from a list of pages __always under the root page.__
* It __does not support nested pages__. So, all pages without id will be created/updated under the root page. The `ancestors` property is not supported in this mode.
* It supports to pass specific ids for the pages. Read [Updating specific pages](#updating-specific-pages) for more information.

### Updating specific pages

As mentioned in the [features](#features) section, it is possible to update specific pages by using their Confluence id. This is __only supported in flat mode__.

> ![Caution]
> If all pages in the list have an id, __you should not provide a root page id__. If you provide it, the library will consider that you don't want any page under it, and, therefore, __it will delete all root page children.__

```js title="Example updating specific pages"
import { ConfluenceSyncPages, SyncModes } from '@tid-cross/confluence-sync';

const confluenceSyncPages = new ConfluenceSyncPages({
  url: "https://confluence.tid.es",
  personalAccessToken: "*******",
  spaceId: "CTO",
  logLevel: "debug",
  dryRun: false,
  syncMode: SyncModes.FLAT,
});

await confluenceSyncPages.sync([
  {
    id: '12345678',
    title: 'Welcome to the documentation',
    content: 'This is the content of the page',
  },
  {
    id: '23456789',
    title: 'Introduction to the documentation',
    content: 'This is the content of the page',
  },
  {
    id: '34567890',
    title: 'How to get started',
    content: 'This is the content of the page',
    attachments: {
      'image.png': '/path/to/image.png',
    },
  }
]);
```

### API

#### `ConfluenceSyncPages`

The main class of the library. It receives a configuration object with the following properties:

* `url`: URL of the Confluence instance.
* `personalAccessToken`: Personal access token to authenticate in Confluence.
* `spaceId`: Key of the space where the pages will be created.
* `rootPageId`: ID of the root page under the pages will be created. It only can be missing if the sync mode is `flat` and all the pages provided have an id.
* `logLevel`: One of `silly`, `debug`, `info`, `warn`, `error` or `silent`. Default is `silent`.
* `dryRun`: If `true`, the pages will not be created/updated/deleted, but the library will log the actions that would be performed. Default is `false`.
* `syncMode`: One of `tree` or `flat`. If `tree`, the pages will be created/updated/deleted under the root page, following the hierarchy provided in the list of pages. If `flat`, the sync method will update the confluence pages that correspond to the ids provided in the pages passed as input, and pages without confluence id will be created/updated under confluence root page corresponding to the rootPageId. Default is `tree`.

When an instance is created, it expose next methods:

#### `sync`

This method receives a list of pages to sync, and it creates/deletes/updates the corresponding Confluence pages. All the pages are created under a root page, which must be also provided. Note that the root page must exist before running the sync process, and that all pages not present in the list will be deleted.

The list of pages to sync is an array of objects with the following properties:

* `id`: _(optional)_ ID of the page. Only used if the sync mode is `flat`.
* `title`: Title of the page.
* `content`: Content of the page.
* `ancestors`: List of ancestors of the page. It must be an array of page ids. **If the sync mode is `flat`, this property is not supported and any page without id will be created under the root page.**
* `attachments`: Record of images to attach to the page. The key is the name of the image, and the value is the path to the image. The image will be attached to the page with the name provided in the key. The path to the image should be absolute.

### get `logger`

This getter returns the [logger instance](https://github.com/mocks-server/main/tree/master/packages/logger) used internally. You may want to use it to attach listeners, write tests, etc.

## Contributing

Please read our [Contributing Guidelines](./CONTRIBUTING.md) for details on how to contribute to this project before submitting a pull request.

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](./LICENSE) file for details.
