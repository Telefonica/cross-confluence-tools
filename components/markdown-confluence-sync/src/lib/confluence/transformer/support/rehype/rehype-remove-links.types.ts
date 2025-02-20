// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

interface AnchorOptions {
  /** Remove external */
  external?: boolean;
  /** Remove internal */
  internal?: boolean;
}

export interface RehypeRemoveLinksOptions {
  /** Remove anchors */
  anchors?: boolean | AnchorOptions;
  /** Remove images */
  images?: boolean;
}
