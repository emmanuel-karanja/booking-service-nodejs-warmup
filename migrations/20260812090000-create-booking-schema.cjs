"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {

        // =========================
        // USERS
        // =========================
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            role: {
                type: Sequelize.ENUM("HOST", "GUEST"),
                allowNull: false
            },

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },

            passwordHash: {
                type: Sequelize.STRING,
                allowNull: false
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });


        // =========================
        // LISTINGS
        // =========================
        await queryInterface.createTable("listings", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            ownerId: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "users",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            title: {
                type: Sequelize.STRING,
                allowNull: false
            },

            location: {
                type: Sequelize.STRING,
                allowNull: false
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            pricePerNight: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });


        // =========================
        // BOOKINGS
        // =========================
        await queryInterface.createTable("bookings", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            ownerId: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "users",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            listingId: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "listings",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            checkIn: {
                type: Sequelize.DATE,
                allowNull: false
            },

            checkOut: {
                type: Sequelize.DATE,
                allowNull: false
            },

            status: {
                type: Sequelize.ENUM(
                    "PENDING",
                    "CONFIRMED",
                    "CANCELLED"
                ),
                allowNull: false
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },


    async down(queryInterface) {

        // Drop in reverse dependency order
        await queryInterface.dropTable("bookings");
        await queryInterface.dropTable("listings");
        await queryInterface.dropTable("users");

        // PostgreSQL ENUM cleanup
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_users_role";'
        );

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_bookings_status";'
        );
    }
};