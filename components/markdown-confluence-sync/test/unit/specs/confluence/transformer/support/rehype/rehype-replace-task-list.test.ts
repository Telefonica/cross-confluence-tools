// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { rehype } from "rehype";
import { dedent } from "ts-dedent";

import rehypeReplaceTaskList from "@src/lib/confluence/transformer/support/rehype/rehype-replace-task-list";

describe("rehype-replace-task-list", () => {
  it("should be defined", () => {
    expect(rehypeReplaceTaskList).toBeDefined();
  });

  it("should replace task lists with correct task status", () => {
    // Arrange
    const input = dedent`
    <ul class="contains-task-list">
    <li><input type="checkbox" checked> Telefonica ID number</li>
    <li><input type="checkbox"> Office 365</li>
    </ul>
    `;
    const expected = dedent`
    <ac:task-list>
    <ac:task><ac:task-status>complete</ac:task-status><ac:task-body> Telefonica ID number</ac:task-body></ac:task>
    <ac:task><ac:task-status>incomplete</ac:task-status><ac:task-body> Office 365</ac:task-body></ac:task>
    </ac:task-list>
    `;

    // Act
    const actual = rehype()
      .data("settings", { fragment: true })
      .use(rehypeReplaceTaskList)
      .processSync(input)
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should replace task lists with nested lists", () => {
    // Arrange
    const input = dedent`
    <ul class="contains-task-list">
    <li><input type="checkbox" checked> Telefonica ID number
      <ul class="contains-task-list">
        <li><input type="checkbox"> Office 365</li>
      </ul>
    </li>
    </ul>
    `;
    const expected = dedent`
    <ac:task-list>
    <ac:task><ac:task-status>complete</ac:task-status><ac:task-body> Telefonica ID number
      <ac:task-list>
        <ac:task><ac:task-status>incomplete</ac:task-status><ac:task-body> Office 365</ac:task-body></ac:task>
      </ac:task-list>
    </ac:task-body></ac:task>
    </ac:task-list>
    `;

    // Act
    const actual = rehype()
      .data("settings", { fragment: true })
      .use(rehypeReplaceTaskList)
      .processSync(input)
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });

  it("should not replace non-task lists", () => {
    // Arrange
    const input = dedent`
    <ul>
    <li>no checkbox</li>
    </ul>
    `;
    const expected = dedent`
    <ul>
    <li>no checkbox</li>
    </ul>
    `;

    // Act
    const actual = rehype()
      .data("settings", { fragment: true })
      .use(rehypeReplaceTaskList)
      .processSync(input)
      .toString();

    // Assert
    expect(actual).toEqual(expected);
  });
});
