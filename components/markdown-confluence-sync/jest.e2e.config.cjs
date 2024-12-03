// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: MIT

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/test/e2e/specs/*.spec.ts"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  setupFiles: ["<rootDir>/test/e2e/support/setup.ts"],
};
