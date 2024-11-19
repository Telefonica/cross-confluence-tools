// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { u } from "unist-builder";

import { replace } from "@src/lib/support/unist/unist-util-replace";

describe("unist-util-replace", () => {
  it("should be defined", () => {
    expect(replace).toBeDefined();
  });

  it("should replace a node", () => {
    const tree = u("root", [u("paragraph", [u("text", "Hello, world!")])]);

    replace(tree, "text", (node) => ({
      type: "text" as const,
      value: node.value.toUpperCase(),
    }));

    expect(tree).toEqual(
      u("root", [u("paragraph", [u("text", "HELLO, WORLD!")])]),
    );
  });
});
