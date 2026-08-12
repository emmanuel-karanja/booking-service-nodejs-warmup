
import ListingService from "../services/ListingService.js"

export default class BookingController{
    constructor(bookingService){
        this.service=bookingService;

        this.create=this.create.bind(this)
        this.update=this.update.bind(this)
        this.getById=this.update.bind(this)
        this.getAll=this.getAll.bind(this)
    }

    async create(req,res,next){
      try{
        
        const userId=req.user.id;
        const listingId=req.params.id

        const listingService=new ListingService();

        const listing=await listingService.getById(listing);

        if(!listing){
            throw new NotFoundError("Cannot create a booking for a listing that doesn't exist.");
        }
        
        const booking = await this.service.create({
            ...req.body,
            listingId:listingId,
            ownerId:userId});

        res.status(201).json(booking)
      }catch(err){
        next(err);
      }
    }

    async update(req,res,next){
        try{
         const ownerId=req.user.id;
         const bookingId=req.params.id;


        const updatedBooking=await this.service.update(bookingId,ownerId,req.body);

        res.status(200).json(updatedBooking);

        }catch(err){
            next(err)
        }
    }

    async getById(req,res,next){
        try{

        const bookingId=req.params.id
        const ownerId=req.user.id;

        const booking=await this.service.getById(bookingId,ownerId);

        res.status(200).json(booking)

        }catch(err){
            next(err)
        }

    }

    async getAll(req,res,next){
        try{

        const ownerId=req.user.id;
        const bookings=await this.service.getAll(ownerId);

        res.status(200).json(listings)

        }catch(err){
            next(err)
        }

    }

    
}