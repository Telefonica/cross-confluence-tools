# cspell-config

This is a shared configuration for cspell in the monorepo.

## Installation

This component is not published to npm, so it can be used only in the monorepo, and you should not add the dependency to the `package.json` file. The dependency will be managed by Nx, the monorepo tool.

To use this configuration in other component in the monorepo, add the following to your `package.json`

```json
{
  "scripts": {
    "check:spell": "cspell .",
  }
}
```

> [!NOTE]
> Nx will automatically detect the task name and add the dependency with the configuration in this component, so, when any file here is modified, the spell check will be also executed in the other components when corresponding.

You should also add the implicit dependency to the `project.json` file:

```json
{
  "implicitDependencies": [
    "cspell-config"
  ]
}
```

Then you should add the following file to the root of your component, and name it `cspell.config.js`:

```js
const { createConfig } = require("./index.js");

module.exports = createConfig();
```

> [!WARNING]
> This component is a `commonjs` module because some issues has been detected in VSCode extensions for cspell when using `esm` modules. So, you should use the appropriated file extension depending on the type of your component. You should use `.cjs` extension if your component is an `esm` module, or `.js` if it is a `commonjs` module.

## Usage

Once you have installed the configuration, you can run the spell check in your component by using the following command:

```sh
pnpm nx check:spell your-component-name
```

It will be also automatically executed before committing any change due to the repository pre-commit hooks.

## Extending the configuration

It is possible to extend the configuration by passing an object to the `createConfig` function. For example:

```js
const { createConfig } = require("./index.js");

module.exports = createConfig({
  ignorePaths: ["**/*.md"],
});
```

## Custom dictionaries

You can add words to the custom dictionaries in this component. They will be available to all components in the monorepo. To do that, add the words to the corresponding file in the `dictionaries` directory.

## Contributing

Please read the repository [Contributing Guidelines](../../.github/CONTRIBUTING.md) for details on how to contribute to this project before submitting a pull request.

## License

This component is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
