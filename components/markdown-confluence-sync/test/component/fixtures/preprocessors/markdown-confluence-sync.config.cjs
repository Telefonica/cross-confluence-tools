// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: MIT

module.exports = {
  logLevel: "info",
  preprocessors: {
    content: (content, path) => {
      return content
        .replace("Title", "Title modified")
        .replace("paragraph", "paragraph with modified content")
        .replace("{{ path }}", path);
    },
  },
  confluence: {
    url: "http://127.0.0.1:3100",
    personalAccessToken: "foo-token",
    spaceKey: "foo-space-id",
    rootPageId: "foo-root-id",
  },
};
