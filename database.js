import Sequelize from "sequelize";
import dotenv from "dotenv";

const { Sequelize: SequelizeClass } = Sequelize;

dotenv.config({
    path: process.env.NODE_ENV === "test"
        ? ".env.test"
        : ".env"
});

/*
console.log({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: typeof process.env.DB_PASSWORD
});*/

const db = new SequelizeClass(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres"
    }
);

await db.authenticate();

console.log("Database connected");

export default db;