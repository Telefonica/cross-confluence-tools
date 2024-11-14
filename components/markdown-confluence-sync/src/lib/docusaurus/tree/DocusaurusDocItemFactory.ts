import { lstatSync } from "fs";

import type {
  DocusaurusDocItemFactoryFromPathOptions,
  DocusaurusDocItemFactoryInterface,
} from "./DocusaurusDocItemFactory.types.js";
import type { DocusaurusDocTreeItem } from "./DocusaurusDocTree.types.js";
import { DocusaurusDocTreeCategory } from "./DocusaurusDocTreeCategory.js";
import { DocusaurusDocTreePageFactory } from "./DocusaurusDocTreePageFactory.js";

export const DocusaurusDocItemFactory: DocusaurusDocItemFactoryInterface = class DocusaurusDocItemFactory {
  public static fromPath(
    path: string,
    options?: DocusaurusDocItemFactoryFromPathOptions,
  ): DocusaurusDocTreeItem {
    if (lstatSync(path).isDirectory()) {
      return new DocusaurusDocTreeCategory(path, options);
    }
    return DocusaurusDocTreePageFactory.fromPath(
      path,
      options,
    ) as DocusaurusDocTreeItem;
  }
};
