// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { basename, dirname, join } from "node:path";

import type { LoggerInterface } from "@mocks-server/logger";
import { globSync } from "glob";
import { readSync, toVFile } from "to-vfile";
import type { VFile } from "vfile";

import { PathNotExistException } from "../pages/errors/PathNotExistException.js";

import type { GetIndexFileOptions } from "./files.types.js";
/**
 * Checked if file is valid in docusaurus
 * @param path - Page path
 * @returns {boolean}
 */
export function isValidFile(path: string): boolean {
  return isSupportedFile(path) && isNotIndexFile(path);
}

/**
 * Check if file ended with md or mdx
 * @param path - Page path
 * @returns {boolean}
 */
export function isSupportedFile(path: string): boolean {
  return /mdx?$/.test(path);
}

/**
 * Check if file is not an index file
 * index files are the following:
 * - index.md
 * - index.mdx
 * - README.md
 * - README.mdx
 * - [directory-name].md
 * - [directory-name].mdx
 * @param path - Page path
 * @returns {boolean}
 */
export function isNotIndexFile(path: string): boolean {
  const dirnamePath = basename(dirname(path));
  const pattern = buildIndexFileRegExp("", dirnamePath);
  return !pattern.test(path);
}

/**
 * Replace docusaurus admonitions titles to a valid remark-directive
 * @param {string} path - Path to the docs directory
 * @param options - Options with {LoggerInterface} logger
 * @returns {VFile} - File
 */
export function readMarkdownAndPatchDocusaurusAdmonitions(
  path: string,
  options?: { logger?: LoggerInterface },
): VFile {
  const file = toVFile(readSync(path));
  // HACK: fix docusaurus directive syntax
  //  Docusaurus directive syntax is not compatible with remark-directive.
  //  Docusaurus allows title following directive type, but remark-directive does not.
  //  So, we replace `:::type title` to `:::type[title]` here.
  file.value = file.value
    .toString()
    .replace(/^:::([a-z]+) +(.+)$/gm, (_match, type, title) => {
      options?.logger?.debug(
        `Fix docusaurus directive syntax: "${_match}" => ":::${type}[${title}]"`,
      );
      return `:::${type}[${title}]`;
    });
  return file;
}

/**
 * Search for index file in the path
 * @param {string} path - Path to the docs directory
 * @param options - Options with {LoggerInterface} logger
 * @returns {string} - Index file path
 */
export function getIndexFile(
  path: string,
  options?: GetIndexFileOptions,
): string {
  const indexFilesGlob = `{index,README,Readme,${basename(path)}}.{md,mdx}`;
  const indexFilesFounded = globSync(indexFilesGlob, { cwd: path });

  if (indexFilesFounded.length === 0) {
    throw new PathNotExistException(
      `Index file does not exist in this path ${path}`,
    );
  }
  if (indexFilesFounded.length > 1) {
    options?.logger?.warn(
      `Multiple index files found in ${basename(path)} directory. Using ${
        indexFilesFounded[0]
      } as index file. Ignoring the rest.`,
    );
  }

  return join(path, indexFilesFounded[0]);
}

/**
 * Search for index file in the path from a list of paths
 * @param {string} path - Path to search
 * @param {string[]} paths - Available paths
 * @returns {string} - Index file path
 */
export function getIndexFileFromPaths(path: string, paths: string[]): string {
  const indexFiles = [
    "index.md",
    "index.mdx",
    "README.md",
    "Readme.md",
    "README.mdx",
    "Readme.mdx",
    `${basename(path)}.md`,
    `${basename(path)}.mdx`,
  ];

  const indexFilesFounded = indexFiles.find((indexFile) =>
    paths.includes(join(path, indexFile)),
  );

  // This should never happen, because we are checking if the path exists before
  // istanbul ignore next
  if (!indexFilesFounded)
    throw new PathNotExistException(
      `Index file does not exist in this path ${path}`,
    );

  return join(path, indexFilesFounded);
}

/**
 * Build index file regexp
 * @param sep - Separator
 * @param dirnamePath - Directory name
 * @returns {RegExp} - RegExp to match with any index file
 */
export function buildIndexFileRegExp(sep: string, dirnamePath: string) {
  //HACK Use this check to correct an irregular expression when executing unit tests in windows when using parentheses.
  const pathSep = sep === "\\" ? "\\\\" : sep;
  return new RegExp(pathSep + `(index|README|${dirnamePath}).mdx?$`);
}
