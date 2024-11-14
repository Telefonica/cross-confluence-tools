const path = require("node:path");

module.exports = {
  confluence: {
    url: "https://my-confluence.com",
    spaceKey: "CTO",
  },
  docsDir: path.join(__dirname, "./docs"),
};
