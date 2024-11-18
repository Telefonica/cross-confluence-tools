// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { rehype } from "rehype";
import { dedent } from "ts-dedent";

import rehypeRemoveLinks from "@src/lib/confluence/transformer/support/rehype/rehype-remove-links";

describe("rehypeRemoveLinks", () => {
  it("should be defined", () => {
    expect(rehypeRemoveLinks).toBeDefined();
  });

  it("should not remove other elements", () => {
    // Arrange
    const html = "<h1>Hello world</h1>";

    // Act & Assert
    expect(
      rehype()
        .data("settings", { fragment: true })
        .use(rehypeRemoveLinks, { anchors: true, images: true })
        .processSync(html)
        .toString(),
    ).toContain("<h1>Hello world</h1>");
  });

  it("should not remove any link if both options are false", () => {
    // Arrange
    const html = dedent`
    <a href="https://httpbin.org">External Link</a>
    <a href="./image.png">Relative link</a>
    <img src="./image.png">
    `;

    // Act & Assert
    expect(
      rehype()
        .data("settings", { fragment: true })
        .use(rehypeRemoveLinks, { anchors: false, images: false })
        .processSync(html)
        .toString(),
    ).toContain(dedent`
    <a href="https://httpbin.org">External Link</a>
    <a href="./image.png">Relative link</a>
    <img src="./image.png">
    `);
  });

  it("should remove images", () => {
    // Arrange
    const html = dedent`
    <a href="https://httpbin.org">External Link</a>
    <a href="./image.png">Relative link</a>
    <img src="./image.png">
    `;

    // Act & Assert
    expect(
      rehype()
        .data("settings", { fragment: true })
        .use(rehypeRemoveLinks, { anchors: false, images: true })
        .processSync(html)
        .toString(),
    ).not.toContain('<img src="./image.png">');
  });

  it("should not remove links without href", () => {
    // Arrange
    const html = dedent`
    <a>External Link</a>
    <a>Relative Link</a>
    `;

    // Act
    const result = rehype()
      .data("settings", { fragment: true })
      .use(rehypeRemoveLinks, { anchors: true, images: false })
      .processSync(html)
      .toString();

    // Assert
    expect(result).toContain("<a>External Link</a>");
    expect(result).toContain("<a>Relative Link</a>");
  });

  it("should remove all links", () => {
    // Arrange
    const html = dedent`
    <a href="https://httpbin.org">External Link</a>
    <a href="./image.png">Relative Link</a>
    `;

    // Act
    const result = rehype()
      .data("settings", { fragment: true })
      .use(rehypeRemoveLinks, { anchors: true, images: false })
      .processSync(html)
      .toString();

    // Assert
    expect(result).toContain("<span>External Link</span>");
    expect(result).toContain("<span>Relative Link</span>");
  });

  it("should remove only external links", () => {
    // Arrange
    const html = dedent`
    <a href="https://httpbin.org">External Link</a>
    <a href="./image.png">Relative Link</a>
    `;

    // Act
    const result = rehype()
      .data("settings", { fragment: true })
      .use(rehypeRemoveLinks, { anchors: { external: true }, images: false })
      .processSync(html)
      .toString();

    // Assert
    expect(result).toContain("<span>External Link</span>");
    expect(result).toContain('<a href="./image.png">Relative Link</a>');
  });

  it("should remove only internal links", () => {
    // Arrange
    const html = dedent`
    <a href="https://httpbin.org">External Link</a>
    <a href="./image.png">Relative Link</a>
    `;

    // Act
    const result = rehype()
      .data("settings", { fragment: true })
      .use(rehypeRemoveLinks, { anchors: { internal: true }, images: false })
      .processSync(html)
      .toString();

    // Assert
    expect(result).toContain('<a href="https://httpbin.org">External Link</a>');
    expect(result).toContain("<span>Relative Link</span>");
  });
});
