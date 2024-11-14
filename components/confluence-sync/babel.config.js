module.exports = (api) => {
  const isTest = api.env("test");
  if (isTest) {
    return {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript",
      ],
      plugins: [
        [
          "module-resolver",
          {
            root: ["."],
            alias: {
              "@src": "./src",
              "@support": "./test/unit/support",
            },
          },
        ],
      ],
    };
  }
};
