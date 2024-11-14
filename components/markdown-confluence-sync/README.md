# markdown-confluence-sync

This library is used to sync Docusaurus Docs with Confluence pages. It reads the Docusaurus Docs and creates/deletes/updates the corresponding Confluence pages. All the pages are created under a parent page, which must be provided in configuration. Note that the parent page must exist before running the sync process, and that all pages not present in the Docusaurus docs will be deleted.

## Table of Contents

- [Features](#features)
  - [Markdown conversion](#markdown-conversion)
  - [Sync mode](#sync-mode)
- [Usage](#usage)
  - [Installation](#installation)
  - [Using the CLI](#using-the-cli)
    - [Configuration](#configuration)
      - [Configuration file](#configuration-file)
        - [Arguments](#arguments)
  - [Using the library](#using-the-library)
    - [API](#api)
      - [`DocusaurusToConfluence`](#docusaurustoconfluence)
      - [`sync`](#sync)
  - [Automation notice](#automation-notice)
- [Development](#development)
  - [Installation](#installation-1)
  - [Monorepo tool](#monorepo-tool)
  - [Unit tests](#unit-tests)
  - [Component tests](#component-tests)
  - [Build](#build)
  - [NPM scripts reference](#npm-scripts-reference)

## Features

This library requires a Confluence instance with the [Confluence REST API](https://developer.atlassian.com/cloud/confluence/rest/) enabled. It also requires a personal access token to authenticate against the Confluence instance. You can create one in the Personal access tokens section of your Atlassian account.

It also requires a Docusaurus project with the [docs plugin](https://docusaurus.io/docs/docs-introduction) installed. The library will read the docs from the Docusaurus project and create/delete/update the corresponding Confluence pages following the same hierarchical structure under a provided Confluence page depending on the synchronization mode to use (which will be explained below).

Pages to be synced must have a `title` property, and a `sync_to_confluence` property set to `true` in the page [frontmatter](https://docusaurus.io/docs/create-doc#doc-front-matter).

The library has two modes in the configuration for sync pages (`tree` or `flat`):
* `tree` sync mode - mirrors the hierarchical pages structure from given docs folder under a Confluence root page.
* `flat` sync mode - synchronize a list of pages matched by a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) as children page of a Confluence root page, without any hierarchy.
  * As an extra in this mode, a Confluence id can be provided to each page using the frontmatter, and, in such case, the corresponding Confluence page will be always updated, even when it is not a children of the Confluence root page.

You have also must take into account next consideration:

* Some files are considered index files of categories, these files represent the content of the category itself and contain it's metadata. These **index files**, from now on, are `index.md`, `index.mdx`, `README.md` and `README.mdx`, and files with same name as the category's folder name (eg: for category with name `categoryA` either `<categoryA>.md` and `<categoryA>.mdx` will be considered indices).
* In presence of multiple index files in a folder, the library will use the first one found in the following order: `index.md`, `index.mdx`, `README.md` and `README.mdx`, and files with same name as the category's folder name with `.md` and `.mdx` extensions. **The rest of the index files will be ignored.**
* The library adds a notice message at the beginning of every pages content indicating that it has been generated automatically. Read [Automation notice](#automation-notice) for more information.
* Title can be overwritten using the `confluence_title` property in the frontmatter metadata of a Markdown file. This property will replace the title of the page in Confluence.
* Adding ancestors title to its children's title may produce an unnecessarily long titles. To avoid this, you can use the `confluence_short_name` property in the frontmatter metadata of a Markdown file. This property replaces the title of a parent page in its children's title. It should be used only in **index files** for categories. 
  * For example, if the child's title is "`Page`" and the parent, with the title "`Parent Category`," has the property `confluence_short_name` set to "`Parent`," it will appear in Confluence as follows:
    ```diff
    - [Parent Category] Page
    + [Parent] Page
    ```
* To add a prefix slug to all Confluence pages, set the confluence.rootPageName option. 
  * For instance, with the provided configuration, the page "`Page C`" will have the title "`[My Project][Category A][Category B] Page C`" in Confluence:
    ```javascript
    // file:docusaurus.config.js
    module.export ={
      confluence: {
        rootPageName: "My Project",
      },
    };
    ```    


When you use `tree` mode, you have also must take into account next considerations:

* The library uses the **index file** in a folder to create a "parent page" in Confluence. Other docs in the same folder will be created as children of the parent page.
* If the **index file** has not `sync_to_confluence` set to `true`, the library will stop searching for possible children pages in the folder.
* If the folder does not contain an **index file**, the library will create an empty page in Confluence with the same name as the folder, but only when it has children pages to be synced (other pages in the folder or children folders with `sync_to_confluence` set to `true`).
* **Index file** in the root directory will be ignored. For the moment, the library is only able to create pages from files in root directory and under children folders.
* Confluence requires unique page names within a space. To meet this requirement, pages are created by combining the titles of their ancestors with their own title. Ancestors refer to parent pages or categories that the page belongs to. For example:
  * If we have a page named `Page C` with ancestors `Category A` and `Category B` it will be created with the title `[Category A][Category B] Page C` in Confluence.
* Docusaurus provides the ability to specify category item metadata using `_category_.json` or `_category_.yml` files in the respective folder. These files allow you to define various category metadata. Currently, only the **"label"** field is used to overwrite the category page title. Here are a couple of examples to illustrate how this works:
  * If there is a folder named `metadata` within the `docs` directory, and it contains a `_category_.yml` file with the following information, the corresponding page in Confluence will be renamed as _Category with Metadata_:
    ```yaml
    # file:<...docsDir...>/metadata/_category_.yml
    ---
    label: Category with Metadata
    ```
  * Alternatively, if there is a folder named metadata within the docs directory, and it contains an **index file** that sets its title, along with a `_category_.yml` file with the following information, the corresponding page in Confluence will also be renamed as _Category with Metadata_:
    ```markdown
    <!--file:<...docsDir...>/metadata/index.md-->
    ---
    title: Metadata
    ---

    # Metadata
    ```
    ```yaml
    # file:<...docsDir...>/metadata/_category_.yml
    ---
    label: Category with Metadata
    ```

For example, when use `tree` mode, the following Docusaurus docs structure:

```title="Docusaurus project"
docusaurus-website/
├── docs/
│   ├── index.md -> IGNORED
│   ├── category-a/
│   │   ├── index.md -> FOLDER PARENT PAGE
│   │   ├── page-a.md -> category-a/page-a
│   │   ├── page-b.md -> category-a/page-b
│   │   └── category-b/
│   │       ├── index.md -> FOLDER PARENT PAGE. category-a/category-b
│   │       ├── page-a.md -> category-a/category-b/index.md page
│   │       └── page-b.md -> category-a/category-b/index.md page
│   ├── category-c/ -> PARENT PAGE. Empty page created in Confluence
│   │   ├── page-a.md -> CHILD of category-c/page-a
│   │   └── page-b.md -> CHILD of category-c/page-b
│   ├── category-d/ -> PARENT PAGE. Empty page created in Confluence
│   │   ├── _category_.yml -> RENAME CATEGORY TITLE
│   ├── category-e/
│   │   ├── _category_.yml -> RENAME CATEGORY TITLE GIVEN BY INDEX
│   │   └── index.md -> FOLDER PARENT PAGE. category-d/category-e
│   ├── page-a.md -> page-a
│   └── page-b.md -> page-b
├── markdown-confluence-sync.config.js
├── docusaurus.config.js  <- DEFINE YOUR CONFIGURATION HERE
└── package.json
```

When you use `flat` mode, you have also must take into account next considerations:
  * `flat` sync mode need a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) to search files by glob
    * To add a file pattern we using `filesPattern` option.
    * `filesPattern` option use [glob pattern](https://github.com/isaacs/node-glob#glob-primer) to filter files.
    * The `filePattern` option searches all files in the directory but filters the pattern results and ignores all files that do not have one of the following extensions: `md` or `mdx`.
    * For example, with the provided configuration, `flat` synchronization mode will filter to get all files starting with the "check" word. 
      ```javascript
      // file:docusaurus.config.js
      module.export ={
        mode: "flat",
        filesPattern: "**/check*",
      };
      ```

### Markdown conversion

Docusaurus provides some markdown features that are not easy to convert to Confluence HTML format without defining a custom style for them. There are also other details that make difficult to convert links or images, for example. So, for the moment, the library only supports a subset of markdown features. Here is a list of some features that are not supported yet:

* [Admonitions](https://docusaurus.io/docs/markdown-features/admonitions) - Docusaurus admonitions are converted to block quotes keeping their content.
* Images - Images are removed.
* MDX - MDX files are supported, but you must take into account the following considerations:
  * MDX files are processed, but MDX syntax will be removed except for the Tabs tags.
  * [Docusaurus MDX code blocks](https://docusaurus.io/docs/i18n/crowdin#mdx-solutions) will be removed, except for the next tags:
    * [Tabs](https://docusaurus.io/docs/markdown-features/tabs) - This is a Docusaurus feature that is not supported by Confluence, so the plugin tries to convert it to a list.
      * The plugin converts the tabs to lists, and the content of each tab is added as a list item.
      * If there are nested tabs, the plugin will add a sub-list to the list item.
      * It is important to mention that the plugin does not support any tab properties, like `groupId`, `values`, or `labels`.
      * The only supported and mandatory property is the `label` property in each tab item. This property is used as the title of the list item.
      * CAUTION: Only tabs in .mdx files are supported. Tabs in .md files are not supported and will cause an error.
      * For example, the following tabs in an MDX file:
        ```markdown
        <Tabs>
          <TabItem value="first" label="First Tab">
            This is the first tab.
          </TabItem>
          <TabItem value="second" label="Second Tab">
            This is the second tab.
          </TabItem>
        </Tabs>
        ```
        will be converted to:
        ```markdown
        - First Tab
          - This is the first tab.
        - Second Tab
          - This is the second tab.
        ```

* Footnotes - Footnotes are removed.
* [Mermaid diagrams](https://docusaurus.io/docs/next/markdown-features/diagrams) - Mermaid diagrams are converted to images.
  * The image is generated with `SVG` format, and synced to confluence with a with of 1000 pixels.
  * The plugin generates a SVG image for each diagram and uploads it to Confluence. Then the image is then linked in the page.
  * The images are stored in a folder named `mermaid-diagrams` in the directory of the page.
  * To ignore the autogenerated images in your repository, you can add the following line to your `.gitignore` file:
    ```gitignore
    **/mermaid-diagrams/
    ```
* [Details](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) - Details HTML tags are converted to a Confluence expand macro.
  * The plugin converts the details to an expand macro, and the content of the details is added as the body of the expand macro.
  * The details tag must have a summary tag as its first child. It will be used as the title of the expand macro.
  * The plugin does not support any details properties, like `open`.
  * Do not use mdx syntax inside the details tag (except for tabs tags, which are supported).
  * For example, the following details in a markdown file:
    ```markdown
    <details>
      <summary>Click to expand</summary>
      This is the content of the details.
    </details>
    ```
    will be converted to:
    ```markdown
    <ac:structured-macro ac:name="expand">
      <ac:parameter ac:name="title">Click to expand</ac:parameter>
      <ac:rich-text-body><p>This is the content of the details.</p></ac:rich-text-body>
    </ac:structured-macro>
    ```
    
### Sync mode

The library has two modes for reading pages (`tree` or `flat`), by default the pages will be read in `tree`. 
* The `Tree` mode will create a hierarchy as we have defined it and send the pages to confluence with their ancestors. To activate this mode you can either not add this option, as it will take the default `tree` option:
  ```json title="markdown-confluence-sync.config.js"
  {
    "docsDir": "docs",    
    "confluence": {
      ...
    }
  }
  ```
  
  or set the `mode` option to `tree`:
  ```json title="markdown-confluence-sync.config.js"
  {
    "mode": "tree",
    "docsDir": "docs",
    "confluence": {
      ...
    }
  }
  ```

* The `flat` mode reads pages by file patterns and structures these pages as children of the root. In case there is a confluence id (`confluence_page_id`) in the read page, it always updates the Confluence page with that id.

  When the mode option is `flat`, the library needs a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) pattern to find the files, which must be defined using the `filesPattern` option.

  ```json title="markdown-confluence-sync.config.js"
  {
    "mode": "flat",
    "filesPattern": "**/check*",
  }
  ```

## Usage

### Installation

This package is not published in NPM, so, for the moment it can be used only in this repository through PNPM workspaces. To use it, you have to add it to your dependencies in the `package.json` file.

```json title="package.json"
{
  "dependencies": {
    "markdown-confluence-sync": "workspace:*"
  }
}
```

### Using the CLI

Once installed, the library provides an NPM binary named `markdown-confluence-sync` that can be used to sync the docs in a Docusaurus project with Confluence pages. To use it, you can add a script in your `package.json` file:

```json title="package.json"
{
  "scripts": {
    "markdown-confluence-sync": "markdown-confluence-sync"
  }
}
```

Then, you can run it with:

```sh
pnpm run markdown-confluence-sync
```

#### Configuration

All of the configuration properties can be provided through a configuration file, CLI arguments, or environment variables (Read the [`@mocks-server/config` package](https://github.com/mocks-server/main/tree/master/packages/config) for further info, which is used under the hood).

The namespace for the configuration of this library is `markdown-confluence-sync`, so, for example, to set environment variables you have to prefix the variable name with `MARKDOWN_CONFLUENCE_SYNC_`. For example, to set the `docsDir` property, you have to set the `MARKDOWN_CONFLUENCE_SYNC_DOCS_DIR` environment variable.

| Property | Type | Description | Default |
| --- | --- | --- | --- |
| `logLevel` | `string` | Log level. One of `silly`, `debug`, `info`, `warn`, `error`, `silent` | `info` |
| `mode` | `string` | Mode to read the pages to send to Confluence. One of `tree`, `flat`.  | `tree` |
| `filesPattern` | `string` | Pattern to read the pages to send to Confluence. This option is mandatory when used `flat` sync mode.  |  |
| `docsDir` | `string` | Path to the docs directory. | `./docs` |
| `confluence.url` | `string` | URL of the Confluence instance. | |
| `confluence.personalAccessToken` | `string` | Personal access token to authenticate against the Confluence instance. | |
| `confluence.spaceKey` | `string` | Key of the Confluence space where the pages will be synced. | |
| `confluence.rootPageId` | `string` | Id of the Confluence parent page where the pages will be synced. | |
| `confluence.rootPageName` | `string` | Customize Confluence page titles by adding a prefix for improved organization and clarity. | |
| `confluence.noticeMessage` | `string` | Notice message to add at the beginning of the Confluence pages. | |
| `confluence.noticeTemplate` | `string` | Template string to use for the notice message. | |
| `confluence.dryRun` | `boolean` | Log create, update or delete requests to Confluence instead of really making them | `false` |
| `config.readArguments` | `boolean` | Read configuration from arguments or not | `false` |
| `config.readFile` | `boolean` | Read configuration from file or not | `false` |
| `config.readEnvironment` | `boolean` | Read configuration from environment or not | `false` |

##### Configuration file

As mentioned above, the library supports defining the config in a configuration file. It supports many patterns for naming the file, as well as file formats. Just take into account that the namespace for the configuration is `markdown-confluence-sync`, so, a possible configuration file may be named `markdown-confluence-sync.config.js`. Read the [`@mocks-server/config` package](https://github.com/mocks-server/main/tree/master/packages/config) for further info about the supported patterns and formats.

```json title="markdown-confluence-sync.config.js"
{
  "docsDir": "docs",
  "confluence": {
    "url": "https://confluence.tid.es",
    "personalAccessToken": "*******",
    "spaceKey": "CTO",
    "rootPageId": "Cross-Cutting+Enablers/IDP/docs"
  }
}
```

###### Arguments

Configuration properties can be provided through CLI arguments. The name of the argument is the property name prefixed with `--`. For example, to set the `docsDir` property, you have to set the `--docsDir` argument. For boolean properties with a default value of `true`, you can set the `--no-` prefix to set the property to `false`. For example, to set the `config.readArguments` property to `false`, you have to set the `--no-config.readArguments` argument.

```sh
pnpm exec markdown-confluence-sync --docsDir ./docs --logLevel debug
```

### Using the library

You can also import the library in your code and use it programmatically. In this case, you have to provide the configuration as an object when creating the instance, and you can call the `sync` method to start the sync process:

```js title="Programmatic usage"
import path from "path";
import { DocusaurusToConfluence } from '@telefonica-cross/markdown-confluence-sync';

const docusaurusToConfluence = new DocusaurusToConfluence({
  docsDir: path.resolve(__dirname, "..", "docs");
  confluence: {
    url: "https://confluence.tid.es",
    personalAccessToken: "*******",
    spaceKey: "CTO",
    rootPageId: "Cross-Cutting+Enablers/IDP/docs"
  }
});

await docusaurusToConfluence.sync();
```

#### API

##### `DocusaurusToConfluence`

This is the main class of the library. It is used to sync the Docusaurus docs with Confluence pages. It receives the configuration as an object in the constructor. The configuration properties are the same as the ones described in the [Configuration](#configuration) section.

Once it is instantiated, it exposes the following methods:

##### `sync`

This method starts the sync process. It returns a promise that resolves when the sync process finishes.

### Automation notice

The library adds a notice message at the beginning of every pages content indicating that it has been generated automatically:

```html
<p><strong>AUTOMATION NOTICE: This page is synced automatically, changes made manually will be lost</strong></p>
```

This message can be customized by using the `confluence.noticeMessage` option. But note that the resultant message will always be wrapped in a `<p>` and a `<strong>` tag.

You can also use the `confluence.noticeTemplate` option to provide a custom template for the resulting message. Under the hood, [Handlebars](https://handlebarsjs.com/) is used to provide the next variables to the template for your convenience:
  * `{{relativePath}}`: The relative path of the markdown file that generated the Confluence page.
  * `{{relativePathWithoutExtension}}`: The relative path of the markdown file that generated the Confluence page, but without the file extension.
  * `{{title}}`: The title of the page.
  * `{{message}}`: The message set by `confluence.noticeMessage`.
  * `{{default}}`: The default message.

```js
/** @type {import('@telefonica-cross/markdown-confluence-sync').Configuration} */

module.exports = {
  docsDir: "./docs",
  confluence: {
    noticeTemplate:
      '{{default}}. Edit url: <a href="https://github.com/Telefonica/cross-idp/edit/main/components/website-static/docs/{{relativePath}}">Github</a>',
  }
};
```

:warning: **Caveat**: The template is evaluated as **raw HTML** in Confluence, so use it with caution.



## Development

### Installation

TypeScript components of the IDP project use Pnpm as dependencies manager. So, to start working on them, you have to install the dependencies by running `pnpm install` in the root folder of the repository.

Please refer to the monorepo README file for further information about [common requirements](../../README.md#requirements) and [installation process](../../README.md#installation) of all TypeScript components.

### Monorepo tool

Note that this component is part of a monorepo, so you can execute any command of the components from the root folder, and Nx will take care of executing the dependent commands in the right order. Any command described here should be executed from the root folder of the repository, using Nx.

For example, a command like this:

```sh title="Execute unit tests of the component inside its folder"
pnpm run test:unit
```

Should be executed like this:

```sh title="Execute unit tests of the component, and all needed dependencies, from root folder"
pnpm nx test:unit markdown-confluence-sync
```

### Unit tests

Unit tests are executed using [Jest](https://jestjs.io/). To run them, execute the following command:

```sh
pnpm run test:unit
```

### Component tests

Component tests are executed using [Jest](https://jestjs.io/) also, but they use a child process to start the component's CLI and verify that it calls to the Confluence API as expected. The Confluence API is mocked using a mock server, so the component doesn't need to connect to a real Confluence instance. The mock server is in the `confluence-sync-pages` package, and it is started automatically when the component tests are executed.

There are different docs fixtures in the `test/component/fixtures` directory that are used to test different scenarios.

To run them, execute the following command, which will start the mock server and execute the tests:

```sh
pnpm run test:component
```

You can also start the mock server in a separate terminal, and then execute the tests, which will allow you to see and change the requests and responses in the mock server in real time, so you can better understand what is happening, and debug the tests:

```sh
pnpm run confluence:mock
```

And, in a separate terminal:

```sh
pnpm run test:component:run
```

### Build

This command generates the library into the `dist` directory, which is the one defined as the entry point in the `package.json` file. __Note that other components in the repository won't be able to use the library until this command is executed.__

```sh
pnpm run build
```

__Warning: The library's CLI won't work until the build process is executed.__

### NPM scripts reference

- `test:unit` - Run unit tests.
- `build` - Build the library.
- `check:types` - Checks the TypeScript types.
- `lint` - Lint the code.
- `lint:fix` - Fix lint errors.
