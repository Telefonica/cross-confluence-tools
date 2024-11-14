---
id: foo-parent
title: foo-parent-title
sync_to_confluence: true
---

# Title

:::note
⭐ this is an admonition
:::


## External Link

This is a link:

[External link](https://httpbin.org)

## Internal Link

This is a link:

[Internal link](./child1/index.md)

## Mdx Code Block

This is a mdx code block:
```mdx-code-block
    <h1>Mdx code block test</h1>
```

## Details
<!-- eslint-disable-next-line markdown/no-html -->
<details><summary>Details</summary>
```markdown
    :::caution Status
    Proposed
    :::
```
</details>

## Footnotes

This is a paragraph with a footnote[^1].

[^1]: This is a footnote.

