import jwt from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError.js";

export default function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return next(
            new UnauthorizedError("Authorization required")
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = payload;

        return next();

    } catch (err) {
        return next(
            new UnauthorizedError("Invalid or expired token")
        );
    }
}