import Sequelize from "sequelize";

import db from "../database.js"

const { Model, DataTypes } = Sequelize;

export default class Booking extends Model{
    static initModel(sequelize){
        Booking.init({
            id:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            listingId:{
                type:DataTypes.INTEGER,
                allowNull:false
            },
            ownerId:{
                type:DataTypes.INTEGER,
                allowNull:false
            },
            checkIn:{
                type:DataTypes.DATE,
                allowNull:false,
                validate: {
                    notInPast(value) {
                        if (value < new Date()) {
                            throw new Error("checkIn cannot be in the past");
                        }
                    }
                }
            },
            checkOut:{
                type:DataTypes.DATE,
                allowNull:false,
                validate: {
                    notInPast(value) {
                        if (value < new Date()) {
                            throw new Error("checkOut cannot be in the past");
                        }
                    },

                    afterCheckIn(value) {
                        if (value <= this.checkIn) {
                            throw new Error(
                                "checkOut must be greater than checkIn"
                            );
                        }
                    }
                }
            },
            status:{
                type:DataTypes.ENUM(
                    "PENDING",
                    "CONFIRMED",
                    "CANCELLED"
            ),
                allowNull:false,
                defaultValue:"PENDING"
            }

        },
        {
            sequelize:db,
            modelName:"Booking",
            tableName:"bookings"
        });

        return Booking;

    }

    static associate(models){

        Booking.belongsTo(models.User,{
            foreignKey:"ownerId"
        });

        Booking.belongsTo(models.Listing,{
            foreignKey:"listingId"
        })
    }
}