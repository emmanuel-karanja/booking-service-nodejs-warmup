module.exports = {
    development: {
        username: "db_user",
        password: "booking_password",
        database: "booking_app",
        host: "127.0.0.1",
        port: 5432,
        dialect: "postgres"
    },

    test: {
        username: "test_db_user",
        password: "test_booking_password",
        database: "booking_test_database",
        host: "127.0.0.1",
        port: 5432,
        dialect: "postgres"
    }
};