import { DocusaurusDocPage } from "./DocusaurusDocPage.js";
import type { DocusaurusDocPageInterface } from "./DocusaurusDocPage.types.js";
import type {
  DocusaurusDocPageFactoryFromPathOptions,
  DocusaurusDocPageFactoryInterface,
} from "./DocusaurusDocPageFactory.types.js";
import { DocusaurusDocPageMdx } from "./DocusaurusDocPageMdx.js";

export const DocusaurusDocPageFactory: DocusaurusDocPageFactoryInterface = class DocusaurusDocPageFactory {
  public static fromPath(
    path: string,
    options?: DocusaurusDocPageFactoryFromPathOptions,
  ): DocusaurusDocPageInterface {
    if (path.endsWith(".mdx")) {
      return new DocusaurusDocPageMdx(path, options);
    }
    return new DocusaurusDocPage(path, options);
  }
};
