export class NoDatabaseError extends Error {
  constructor() {
    super("NoDatabaseError - No Database Defined");

    this.name = "NoDatabaseError";
  }
}
