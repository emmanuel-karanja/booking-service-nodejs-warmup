

import {Router} from "express"
import ListingController from "../controllers/ListingController.js"
import {CreateListingSchema,UpdateListingSchema} from "../models/Listing.js"
import validate from "../middleware/ValidateMiddleware.js"
import authenticate from "../middleware/AuthMiddleware.js"

import ListingService from "../services/ListingService.js"

const router=Router();


const controller=new ListingController(new ListingService())

// Only this path is unsecured
router.get("/listings",controller.getAll);

router.post("/listings",
    authenticate,
    validate(CreateListingSchema),
    controller.create);

router.get("/listings/:id",
    controller.getById);

router.put("/listings",
    authenticate,
    validate(UpdateListingSchema),
    controller.update);

export default router