import type {
  ConfigNamespaceInterface,
  OptionInterfaceOfType,
  OptionDefinition,
} from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";
import type { ConfluenceInputPage } from "@telefonica-cross/confluence-sync";

import type { ModeOption } from "../DocusaurusToConfluence.types";

type UrlOptionValue = string;
type PersonalAccessTokenOptionValue = string;
type SpaceKeyOptionValue = string;
type RootPageIdOptionValue = string;
type RootPageNameOptionValue = string;
type NoticeMessageOptionValue = string;
type NoticeTemplateOptionValue = string;
type DryRunOptionValue = boolean;

declare global {
  //eslint-disable-next-line @typescript-eslint/no-namespace
  namespace DocusaurusToConfluence {
    interface Config {
      confluence?: {
        /** Confluence URL */
        url?: UrlOptionValue;
        /** Confluence personal access token */
        personalAccessToken?: PersonalAccessTokenOptionValue;
        /** Confluence space key */
        spaceKey?: SpaceKeyOptionValue;
        /** Confluence root page id */
        rootPageId?: RootPageIdOptionValue;
        /** Confluence dry run */
        dryRun?: DryRunOptionValue;
      };
    }
  }
}

export type UrlOptionDefinition = OptionDefinition<UrlOptionValue>;
export type PersonalAccessTokenOptionDefinition =
  OptionDefinition<PersonalAccessTokenOptionValue>;
export type SpaceKeyOptionDefinition = OptionDefinition<SpaceKeyOptionValue>;
export type RootPageIdOptionDefinition =
  OptionDefinition<RootPageIdOptionValue>;
export type RootPageNameOptionDefinition =
  OptionDefinition<RootPageNameOptionValue>;
export type NoticeMessageOptionDefinition =
  OptionDefinition<NoticeMessageOptionValue>;
export type NoticeTemplateOptionDefinition =
  OptionDefinition<NoticeTemplateOptionValue>;
export type DryRunOptionDefinition = OptionDefinition<
  DryRunOptionValue,
  { hasDefault: true }
>;

export type UrlOption = OptionInterfaceOfType<UrlOptionValue>;
export type PersonalAccessTokenOption =
  OptionInterfaceOfType<PersonalAccessTokenOptionValue>;
export type SpaceKeyOption = OptionInterfaceOfType<SpaceKeyOptionValue>;
export type RootPageIdOption = OptionInterfaceOfType<RootPageIdOptionValue>;
export type RootPageNameOption = OptionInterfaceOfType<RootPageNameOptionValue>;
export type NoticeMessageOption =
  OptionInterfaceOfType<NoticeMessageOptionValue>;
export type NoticeTemplateOption =
  OptionInterfaceOfType<NoticeTemplateOptionValue>;
export type DryRunOption = OptionInterfaceOfType<
  DryRunOptionValue,
  { hasDefault: true }
>;

export interface ConfluenceSyncOptions {
  /** Configuration interface */
  config: ConfigNamespaceInterface;
  /** Logger interface */
  logger: LoggerInterface;
  /** Sync mode option */
  mode: ModeOption;
}

/** Creates a ConfluenceSyncInterface interface */
export interface ConfluenceSyncConstructor {
  /** Returns ConfluenceSyncInterface interface
   * @returns ConfluenceSync instance {@link ConfluenceSyncInterface}.
   */
  new (options: ConfluenceSyncOptions): ConfluenceSyncInterface;
}

export interface ConfluenceSyncInterface {
  /** Sync pages to Confluence */
  sync(pages: ConfluenceSyncPage[]): Promise<void>;
}

/** Represents a Confluence page with its path */
export interface ConfluenceSyncPage extends ConfluenceInputPage {
  /**
   * Confluence page ancestors
   * @override
   * @see {@link DocusaurusPage}
   */
  ancestors: string[];
  /** Confluence page path */
  path: string;
  /** Confluence page path relative to docs root dir */
  relativePath: string;
  /**
   * Confluence page name
   *
   * Forces the confluence page title in child pages' title.
   */
  name?: string;
}
