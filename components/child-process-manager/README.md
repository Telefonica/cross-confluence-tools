# child-process-manager

This library allows to create a child process using `cross-spawn`, which provides compatibility across different operating systems, and manage its lifecycle. It mainly provides:

* Allows to handle child processes as promises. The promise is resolved when the process finish successfully, and rejected when it fails.
* Allows to kill the child process when the parent process is killed.
* Allows to get logs from the child process.

## Table of Contents

- [Usage](#usage)
  - [Installation](#installation)
  - [Example](#example)
- [Development](#development)
  - [Installation](#installation-1)
  - [Monorepo tool](#monorepo-tool)
  - [Unit tests](#unit-tests)
  - [Build](#build)
  - [NPM scripts reference](#npm-scripts-reference)

## Usage

### Installation

This package is not published in NPM, so, for the moment it can be used only in this repository through PNPM workspaces. To use it, you have to add it to your dependencies in the `package.json` file:

```json title="package.json"
{
  "dependencies": {
    "@telefonica-cross/child-process-manager": "workspace:*"
  }
}
```

### Example

Import the library, create a child process and wait for it to finish. It will return the exit code and the logs in the resolved object.

```js title="Example"
import { ChildProcessManager } from '@telefonica-cross/child-process-manager';

const childProcess = new ChildProcessManager(["echo", 'Hello world!']);

const { logs, exitCode } = await childProcess.run();

console.log(logs); // ["Hello world!"]
console.log(exitCode); // 0
```

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
pnpm nx test:unit child-process-manager
```

### Unit tests

Unit tests are executed using [Jest](https://jestjs.io/). To run them, execute the following command:

```sh
pnpm run test:unit
```

### Build

This command generates the library into the `dist` directory, which is the one defined as the entry point in the `package.json` file. __Note that other components in the repository won't be able to use the library until this command is executed.__

```sh
pnpm run build
```

### NPM scripts reference

- `test:unit` - Run unit tests.
- `build` - Build the library.
- `check:types` - Checks the TypeScript types.
- `lint` - Lint the code.
- `lint:fix` - Fix lint errors.

