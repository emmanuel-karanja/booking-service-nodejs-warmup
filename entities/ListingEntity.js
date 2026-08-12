
import Sequelize from "sequelize";

const { Model, DataTypes } = Sequelize;

import db from "../database.js"

export default class Listing extends Model{
    static initModel(sequelize){
        Listing.init({
            id:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            title:{
                type:DataTypes.STRING,
                allowNull:false
            },
            description:{
                type:DataTypes.TEXT,
                allowNull:false
            },
            location:{
                type:DataTypes.TEXT,
                allowNull:false
            },
            ownerId:{
                type:DataTypes.INTEGER,
                allowNull:false
            },
            pricePerNight: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    min: 0
                },
                // Fixes the "5000" instead of 5000 issue for prices
                get() {
                    const value = this.getDataValue("pricePerNight");
                    return value === null ? null : Number(value);
                }
            }
        },
        {
            sequelize:db,
            modelName: "Listing",
            tableName:"listings"
        });

        return Listing;
    }

    static associate(models){

        Listing.belongsTo(models.User,{
            foreignKey:"ownerId"
        });

        Listing.hasMany(models.Booking,{
            foreignKey:"listingId"
        });
    }
}