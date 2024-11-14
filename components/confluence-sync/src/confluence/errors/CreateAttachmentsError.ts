export class CreateAttachmentsError extends Error {
  constructor(id: string, options?: ErrorOptions) {
    super(
      `Error creating attachments of page with id ${id}: ${options?.cause}`,
      options,
    );
  }
}
