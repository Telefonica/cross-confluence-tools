// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: MIT

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "<rootDir>/test/component/specs/*.spec.ts",
    "<rootDir>/test/component/specs/**/*.test.ts",
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",
};
