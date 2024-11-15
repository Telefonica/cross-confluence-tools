# confluence-sync-pages

This library is used to sync Confluence pages. It has two modes: tree and flat:
* In tree mode, the library receives an object defining a tree of Confluence pages, and it creates/deletes/updates the corresponding Confluence pages. All the pages are created under a root page, which must be also provided. Note that the root page must exist before running the sync process, and that all pages not present in the list will be deleted.
* In flat mode, the library receives a list of Confluence pages, which can't be nested. Then, the library creates/deletes/updates the corresponding Confluence pages under a root page, which must be also provided. Note that the root page must exist before running the sync process, and that all pages under the root page not present in the list will be deleted.
  * In flat mode, a Confluence id can be also provided for each page, and then it will be used to update the corresponding Confluence page. In such case, the root page is ignored. So, if all the pages have an id, the root page is not needed.


## Table of Contents

- [Features](#features)
- [Usage](#usage)
  - [Installation](#installation)
  - [Example](#example)
  - [API](#api)
    - [`ConfluenceSyncPages`](#confluencesyncpages)
    - [`sync`](#sync)
- [Development](#development)
  - [Installation](#installation-1)
  - [Monorepo tool](#monorepo-tool)
  - [Unit tests](#unit-tests)
  - [Component tests](#component-tests)
  - [Build](#build)
  - [NPM scripts reference](#npm-scripts-reference)

## Features

The library supports the following features:

Sync Mode: Tree
* Create Confluence pages from a list of pages with their corresponding paths, under a root page.
* Support for nested pages.
* Create Confluence pages if they don't exist.
* Update Confluence pages if they already exist.
* Delete Confluence pages that are not present in the list.
* Support for images.

Sync Mode: Flat
* Update Confluence pages from a list of pages with id that already exist.
* Create Confluence pages from a list of pages without id under the root page.
* Update Confluence pages without id, if they already exist under the root page.
* Delete Confluence pages under the root page that are not present in the list.
* Support for images.

## Usage

### Installation

This package is not published in NPM, so, for the moment it can be used only in this repository through PNPM workspaces. To use it, you have to add it to your dependencies in the `package.json` file:

```json title="package.json"
{
  "dependencies": {
    "@tid-cross/confluence-sync": "workspace:*"
  }
}
```

### Sync Mode: Tree

- By default, the library will run in tree mode. If you want to run it in flat mode, you have to set the `syncMode` property of the configuration object to `flat`.
- The images are uploaded to Confluence as attachments. The library will create a new attachment if it doesn't exist, or delete it and create it again if it already exists.
- The library assumes that the Confluence instance is using the default page hierarchy, where pages are organized in spaces. The library will create all the pages under a root page of the space.
- The root page must exist before running the sync process.
- The ancestors of each page should be ordered from the root page to the page itself. For example, if you want to create a page under the page `Introduction to the documentation`, which is under the page `Welcome to the documentation`, you should provide the following list of ancestors: `['Welcome to the documentation', 'Introduction to the documentation']`.
- The first ancestor of each page must be the root page, if not, it will be added automatically.
- As a consequence of the previous point, the library doesn't support to update the root page.
- The pages are identified by their title. If a page with the same title already exists, it will be updated. If it doesn't exist, it will be created.
- The pages not present in the list will be deleted.
- The library doesn't support to move pages from one parent to another. If you want to move a page, you should delete it and create it again under the new parent.
- To get the ID of the root page, you can use the [Confluence REST API](https://developer.atlassian.com/cloud/confluence/rest/api-group-content/#api-api-content-get) or follow the next steps:
  * Enter to Confluence.
  * Go to the page of the space where you want to create the pages. 
  * Click on the `...` button and select `Page information`.
  * Copy the ID of the page from the URL. For example, if the URL is `https://confluence.tid.es/pages/viewpage.action?pageId=12345678`, the ID of the page is `12345678`. 

#### Example

Once installed, you can import it and use it in your code, and then execute it passing a list of pages to sync:

```js title="Example"
import { ConfluenceSyncPages } from '@tid-cross/confluence-sync';

const confluenceSyncPages = new ConfluenceSyncPages({
  url: "https://confluence.tid.es",
  personalAccessToken: "*******",
  spaceId: "CTO",
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

### Sync Mode: Flat

- By default, the library will run in tree mode. If you want to run it in flat mode, you have to set the `syncMode` property of the configuration object to `flat`.
- The images are uploaded to Confluence as attachments. The library will create a new attachment if it doesn't exist, or delete it and create it again if it already exists.
- The pages provided with id must exist before running the sync process.
- If all the pages provided have an id, rootPageId is not required.
- The pages provided with id will be updated, the pages provided without id will be created/updated under the root page.
- If rootPageId is provided, the pages under the root page that are not present in the input will be deleted.
- Pages without id must not have ancestors. Those pages will be created/updated under the root page.

#### Example

```js title="ExampleWithFlatMode"
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

This class is the main class of the library. It receives a configuration object with the following properties:

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
