const path = require("node:path");

module.exports = {
  confluence: {
    // Force config error to test error handling
    url: 2,
    spaceKey: "CTO",
  },
  docsDir: path.join(__dirname, "./docs"),
};
