export class CreatePageError extends Error {
  constructor(title: string, options?: ErrorOptions) {
    super(
      `Error creating page with title ${title}: ${options?.cause}`,
      options,
    );
  }
}
