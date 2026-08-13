import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../entities/index.js"

import UnauthorizedError from "../errors/UnauthorizedError.js"

export default class UserService {

    async register(data) {
        // Generate password hash
        const passwordHash = await bcrypt.hash(data.password, 12);

        const user = await User.create({
            ...data,
            passwordHash
        });

        return this.toUserResponse(user);
    }

    async login(email, password) {
        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const valid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!valid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            token,
            user: this.toUserResponse(user)
        };
    }

    toUserResponse(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    }
}