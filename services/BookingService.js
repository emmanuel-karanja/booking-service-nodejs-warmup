import {Booking,Listing} from "../entities/index.js"

import { Op } from "sequelize";

import NotFoundError from "../errors/NotFoundError.js"

import ConflictError from "../errors/ConflictError.js"

export default class BookingService{


    async create(data) {

        // Find overlapping booking
        const overlappingBooking = await Booking.findOne({
            where: {
                listingId: data.listingId,

                status: {
                    [Op.in]: ["PENDING", "CONFIRMED"]
                },

                [Op.and]: [
                    {
                        checkIn: {
                            [Op.lt]: data.checkOut
                        }
                    },
                    {
                        checkOut: {
                            [Op.gt]: data.checkIn
                        }
                    }
                ]
            }
        });

        if (overlappingBooking) {
            throw new ConflictError(
                "Listing is already booked for the selected dates"
            );
        }

        return Booking.create(data);
    }

    async getById(bookingId,ownerId){
        booking= Booking.findOne({
            where:{
                id:bookingId,
                ownerId
            }
        });

        if(!booking){
            throw new NotFoundError("Listing not found");
        }

        return booking;
    }

    async getAll(ownerId){
        return Booking.findAll({
            where:{
                ownerId
            }
        });
    }

    async update(id, userId, data) {
        const booking = await Booking.findOne({
            where: {
                id,
                userId
            }
        });

        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        return booking.update(data);
    }
}