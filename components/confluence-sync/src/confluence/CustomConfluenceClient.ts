// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { LoggerInterface } from "@mocks-server/logger";
import type { Models } from "confluence.js";
import { ConfluenceClient } from "confluence.js";

import type {
  Attachments,
  ConfluenceClientConfig,
  ConfluenceClientConstructor,
  ConfluenceClientInterface,
  ConfluencePage,
  ConfluencePageBasicInfo,
  ConfluenceId,
  CreatePageParams,
} from "./CustomConfluenceClient.types";
import { AttachmentsNotFoundError } from "./errors/AttachmentsNotFoundError";
import { toConfluenceClientError } from "./errors/AxiosErrors";
import { CreateAttachmentsError } from "./errors/CreateAttachmentsError";
import { CreatePageError } from "./errors/CreatePageError";
import { DeletePageError } from "./errors/DeletePageError";
import { PageNotFoundError } from "./errors/PageNotFoundError";
import { UpdatePageError } from "./errors/UpdatePageError";

export const CustomConfluenceClient: ConfluenceClientConstructor = class CustomConfluenceClient
  implements ConfluenceClientInterface
{
  private _config: ConfluenceClientConfig;
  private _client: ConfluenceClient;
  private _logger: LoggerInterface;

  constructor(config: ConfluenceClientConfig) {
    this._config = config;
    this._client = new ConfluenceClient({
      host: config.url,
      authentication: {
        personalAccessToken: config.personalAccessToken,
      },
      apiPrefix: "/rest/",
    });
    this._logger = config.logger;
  }

  // Exposed mainly for testing purposes
  public get logger() {
    return this._logger;
  }

  public async getPage(id: string): Promise<ConfluencePage> {
    try {
      this._logger.silly(`Getting page with id ${id}`);
      const response: Models.Content =
        await this._client.content.getContentById({
          id,
          expand: ["ancestors", "version.number", "children.page"],
        });
      this._logger.silly(
        `Get page response: ${JSON.stringify(response, null, 2)}`,
      );
      return {
        title: response.title,
        id: response.id,
        version: response.version?.number as number,
        ancestors: response.ancestors?.map((ancestor) =>
          this._convertToConfluencePageBasicInfo(ancestor),
        ),
        children: response.children?.page?.results?.map((child) =>
          this._convertToConfluencePageBasicInfo(child),
        ),
      };
    } catch (error) {
      throw new PageNotFoundError(id, { cause: error });
    }
  }

  public async createPage({
    title,
    content,
    ancestors,
  }: CreatePageParams): Promise<ConfluencePage> {
    if (!this._config.dryRun) {
      const createContentBody = {
        type: "page",
        title,
        space: {
          key: this._config.spaceId,
        },
        ancestors: this.handleAncestors(ancestors),
        body: {
          storage: {
            value: content || "",
            representation: "storage",
          },
        },
      };
      try {
        this._logger.silly(`Creating page with title ${title}`);
        const response =
          await this._client.content.createContent(createContentBody);
        this._logger.silly(
          `Create page response: ${JSON.stringify(response, null, 2)}`,
        );

        return {
          title: response.title,
          id: response.id,
          version: response.version?.number as number,
          ancestors: response.ancestors?.map((ancestor) =>
            this._convertToConfluencePageBasicInfo(ancestor),
          ),
        };
      } catch (e) {
        const error = toConfluenceClientError(e);
        throw new CreatePageError(title, { cause: error });
      }
    } else {
      this._logger.info(`Dry run: creating page with title ${title}`);
      return {
        title,
        id: "1234",
        version: 1,
        ancestors,
      };
    }
  }

  public async updatePage({
    id,
    title,
    content,
    version,
    ancestors,
  }: ConfluencePage): Promise<ConfluencePage> {
    if (!this._config.dryRun) {
      const updateContentBody = {
        id,
        type: "page",
        title,
        ancestors: this.handleAncestors(ancestors),
        version: {
          number: version,
        },
        body: {
          storage: {
            value: content || "",
            representation: "storage",
          },
        },
      };
      try {
        this._logger.silly(`Updating page with title ${title}`);
        const response =
          await this._client.content.updateContent(updateContentBody);
        this._logger.silly(
          `Update page response: ${JSON.stringify(response, null, 2)}`,
        );

        return {
          title: response.title,
          id: response.id,
          version: response.version?.number as number,
          ancestors: response.ancestors?.map((ancestor) =>
            this._convertToConfluencePageBasicInfo(ancestor),
          ),
        };
      } catch (e) {
        const error = toConfluenceClientError(e);
        throw new UpdatePageError(id, title, { cause: error });
      }
    } else {
      this._logger.info(`Dry run: updating page with title ${title}`);
      return {
        title,
        id,
        version,
        ancestors,
      };
    }
  }

  public async deleteContent(id: ConfluenceId): Promise<void> {
    if (!this._config.dryRun) {
      try {
        this._logger.silly(`Deleting content with id ${id}`);
        await this._client.content.deleteContent({ id });
      } catch (error) {
        throw new DeletePageError(id, { cause: error });
      }
    } else {
      this._logger.info(`Dry run: deleting content with id ${id}`);
    }
  }

  public async getAttachments(
    id: ConfluenceId,
  ): Promise<ConfluencePageBasicInfo[]> {
    try {
      this._logger.silly(`Getting attachments of page with id ${id}`);
      const response = await this._client.contentAttachments.getAttachments({
        id,
      });
      this._logger.silly(
        `Get attachments response: ${JSON.stringify(response, null, 2)}`,
      );
      return (
        response.results?.map((attachment) => ({
          id: attachment.id,
          title: attachment.title,
        })) || []
      );
    } catch (error) {
      throw new AttachmentsNotFoundError(id, { cause: error });
    }
  }

  public async createAttachments(
    id: ConfluenceId,
    attachments: Attachments,
  ): Promise<void> {
    if (!this._config.dryRun) {
      try {
        const bodyRequest = attachments.map((attachment) => ({
          minorEdit: true,
          ...attachment,
        }));
        this._logger.silly(
          `Creating attachments of page with id ${id}, attachments: ${attachments
            .map((attachment) => attachment.filename)
            .join(", ")}`,
        );
        const response =
          await this._client.contentAttachments.createAttachments({
            id,
            attachments: bodyRequest,
          });
        this._logger.silly(
          `Create attachments response: ${JSON.stringify(response, null, 2)}`,
        );
      } catch (error) {
        throw new CreateAttachmentsError(id, { cause: error });
      }
    } else {
      this._logger
        .info(`Dry run: creating attachments of page with id ${id}, attachments: ${attachments
        .map((attachment) => attachment.filename)
        .join(", ")}
        `);
    }
  }

  private handleAncestors(
    ancestors?: ConfluencePageBasicInfo[],
  ): { id: string }[] | undefined {
    if (ancestors && ancestors.length) {
      const id = ancestors.at(-1)?.id as string;
      return [{ id }];
    } else {
      return undefined;
    }
  }

  private _convertToConfluencePageBasicInfo(
    rawInfo: Models.Content,
  ): ConfluencePageBasicInfo {
    return {
      id: rawInfo.id,
      title: rawInfo.title,
    };
  }
};
