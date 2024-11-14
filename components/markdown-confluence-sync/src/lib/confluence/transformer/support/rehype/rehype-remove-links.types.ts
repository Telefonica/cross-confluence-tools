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
