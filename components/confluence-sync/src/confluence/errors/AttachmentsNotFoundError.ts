export class AttachmentsNotFoundError extends Error {
  constructor(id: string, options?: ErrorOptions) {
    super(
      `Error getting attachments of page with id ${id}: ${options?.cause}`,
      options,
    );
  }
}
