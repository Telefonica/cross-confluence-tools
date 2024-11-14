export class UpdatePageError extends Error {
  constructor(id: string, title: string, options?: ErrorOptions) {
    super(
      `Error updating page with id ${id} and title ${title}: ${options?.cause}`,
      options,
    );
  }
}
