---
sync_to_confluence: true
title: "[Markdown Confluence Sync] [TypeScript] Releases"
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

#### Added
#### Changed
#### Fixed
#### Deprecated
#### Removed

## [1.0.0-beta.4] - 2024-11-28

### Added

* feat: Add cwd option, enabling to change the working directory from where to load the configuration file, and resolve the docsDir and filesPattern paths.


## [1.0.0-beta.3] - 2024-11-27

### Added

* docs: Add `confluence_id` property to the per-page configuration docs.

### Changed

* feat: Change logs to use "markdown files" instead of "docusaurus pages"
* refactor: Rename first level types and classes to use Markdown instead of Docusaurus.
* docs: Explain clearer the usage of the `confluence_title` property in frontmatter.


## [1.0.0-beta.2] - 2024-11-26

### Added

* feat: Log possible error when trying to parse a markdown file
* docs: Add markdown frontmatter examples
* docs: Add examples of supported config files
* docs: Add link to Confluence Sync documentation

### Fixed

* fix: Fix missed dependencies that were defined as devDependencies
* fix: Add missing supported configuration options to TypeScript typings

## [1.0.0-beta.1] [YANKED]

### Added

* feat: Initial release
