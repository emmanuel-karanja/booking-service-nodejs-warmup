import Sequelize from "sequelize";

const { Model, DataTypes } = Sequelize;

import db from "../database.js"

export default class User extends Model{
    static initModel(sequelize){
        User.init({
            id:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            
            role:{
                type:DataTypes.ENUM(
                    "HOST",
                    "GUEST"
                ),
                allowNull:false
            },
            email:{
                type:DataTypes.STRING,
                allowNull:false,
                unique:true
            },
            passwordHash:{
                type:DataTypes.STRING,
                allowNull:false
            }
        },{
            sequelize:db,
            modelName:"User",
            tableName:"users"
        });

        return User;
    }

    static associate(models){
        User.hasMany(models.Listing,{
            foreignKey:"ownerId"
        });

        User.hasMany(models.Booking,{
            foreignKey:"ownerId"
        })
    }
}