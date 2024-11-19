// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: MIT

const path = require("node:path");

module.exports = {
  confluence: {
    // Force config error to test error handling
    url: 2,
    spaceKey: "CTO",
  },
  docsDir: path.join(__dirname, "./docs"),
};
