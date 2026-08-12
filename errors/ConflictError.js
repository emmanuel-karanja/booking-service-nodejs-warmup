export default class ConflictError extends Error {
    constructor(message = "Conflict error, existing listing") {
        super(message);
        this.name = "ConflictError";
    }
}