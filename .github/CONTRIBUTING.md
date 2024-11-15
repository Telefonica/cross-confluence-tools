# How to contribute

Thank you for being part of the Telefónica Innovación Digital Open Source Community!

# Table of Contents

- [Getting started](#getting-started)
- [License](#license)
  - [Licensing of new files](#licensing-of-new-files)
  - [Public Domain](#public-domain)
- [Pull Request](#pull-request)
- [Code of Conduct](#code-of-conduct)
- [Contributor License Agreement](#contributor-license-agreement)

# Getting started

TO BE FILLED BY THE PROJECT MAINTAINER

# License

By contributing to this project, you agree that your contributions will be licensed under the [LICENSE](../LICENSE) file in the root of this repository, and that you agree to the [Contributor License Agreement](#contributor-license-agreement).

## Licensing of new files

This project adheres to the [Software Package Data Exchange (SPDX)](https://spdx.dev/). SPDX is a standard format for communicating the components, licenses, and copyrights associated with software packages. It is a simple and concise way to communicate licensing information. Read more about how to define headers using the SPDX ids [here](https://spdx.dev/learn/handling-license-info/).

This license must be used for all new code, unless the containing project, module or externally-imported codebase uses a different license. If you can't put a header in the file due to its structure, please put it in a LICENSE file in the same directory.

```
// SPDX-FileCopyrightText: {{ year }} Telefónica Innovación Digital and contributors. All rights reserved
// SPDX-License-Identifier: Apache-2.0

# SPDX-FileCopyrightText: {{ year }} Telefónica Innovación Digital and contributors. All rights reserved
# SPDX-License-Identifier: Apache-2.0

<!--
   SPDX-FileCopyrightText: {{ year }} Telefónica Innovación Digital and contributors. All rights reserved
   SPDX-License-Identifier: Apache-2.0
-->

SPDX-FileCopyrightText: {{ year }} Telefónica Innovación Digital and contributors. All rights reserved
SPDX-License-Identifier: Apache-2.0
```

> ![TIP]
> When modifying  an existing file, you should not change the license year. Instead, please add " - {{ year }}" to the existing year. For example, if the existing license is `2019` and you are doing the change at 2024, you should change it to `2019 - 2024`.

## MIT License

This license can be used for test scripts and other short code snippets, at the discretion of the author.

```
// SPDX-FileCopyrightText: {{ year }} Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: MIT

# SPDX-FileCopyrightText: {{ year }} Telefónica Innovación Digital and contributors
# SPDX-License-Identifier: MIT

<!--
   SPDX-FileCopyrightText: {{ year }} Telefónica Innovación Digital and contributors
   SPDX-License-Identifier: MIT
-->

SPDX-FileCopyrightText: {{ year }} Telefónica Innovación Digital and contributors
SPDX-License-Identifier: MIT
```

# Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

* Fill the PR template. This template helps reviewers understand your changes as well as the purpose of your pull request.
* Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue) if you are solving one.
* Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge. Once you submit your PR, a maintainer will review your proposal. We may ask questions or request additional information.
* We may ask for changes to be made before a PR can be merged, either using suggested changes or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
* As you update your PR and apply changes, mark each conversation as resolved.
* If you run into any merge issues, checkout this git tutorial to help you resolve merge conflicts and other issues.

# Code of Conduct

Please read our [Code of Conduct](../.github/CODE_OF_CONDUCT.md) before contributing.

# Contributor License Agreement

This is a human-readable summary of (and not a substitute for) the [full agreement](./CLA.md). This highlights only some of the key terms of the CLA. It has no legal value and you should carefully review all the terms of the [actual CLA before agreeing](./CLA.md).

* __Grant of copyright license__. You give Telefónica Innovación Digital permission to use your copyrighted work in commercial products.
* __Grant of patent license__. If your contributed work uses a patent, you give Telefónica Innovación Digital a license to use that patent including within commercial products. You also agree that you have permission to grant this license.
* __No Warranty or Support Obligations__. By making a contribution, you are not obligating yourself to provide support for the contribution, and you are not taking on any warranty obligations or providing any assurances about how it will perform.

The [CLA](./CLA.md) does not change the terms of the underlying license used by our software such as the Business Source License, Mozilla Public License, or MIT License. You are still free to use our projects within your own projects or businesses, republish modified source code, and more subject to the terms of the project license. Please reference the appropriate license for the project you're contributing to to learn more.
