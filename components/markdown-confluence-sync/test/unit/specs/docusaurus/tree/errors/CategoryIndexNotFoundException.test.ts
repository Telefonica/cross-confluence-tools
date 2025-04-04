// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { CategoryIndexNotFoundException } from "@src/lib/docusaurus/tree/errors/CategoryIndexNotFoundException";

describe("custom error CategoryIndexNotFoundException", () => {
  it("should have message 'Category index not found: test'", async () => {
    await expect(
      Promise.reject(
        new CategoryIndexNotFoundException("test", { cause: "error test" }),
      ),
    ).rejects.toThrow("Category index not found: test");
  });
});
