import {Router} from "express"
import BookingController from "../controllers/BookingController.js"

import validate from "../middleware/ValidateMiddleware.js"

import authenticate from "../middleware/AuthMiddleware.js"

import {CreateBookingSchema,UpdateBookingSchema} from "../models/Booking.js"
import BookingService from "../services/BookingService.js"

const router=Router()

const controller=new BookingController(new BookingService())

router.get("/bookings",authenticate,
    controller.getAll);

router.get("/bookings/:id",authenticate,
    controller.getById);

router.post("/listings/:id/bookings",
    authenticate,
    validate(CreateBookingSchema),
    controller.create);

router.put("/bookings",
    authenticate,
    validate(UpdateBookingSchema),
    controller.update);


export default router