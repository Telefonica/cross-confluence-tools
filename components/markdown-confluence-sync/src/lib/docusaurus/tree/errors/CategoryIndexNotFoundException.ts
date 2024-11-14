export class CategoryIndexNotFoundException extends Error {
  constructor(category: string, options?: ErrorOptions) {
    super(`Category index not found: ${category}`, options);
  }
}
