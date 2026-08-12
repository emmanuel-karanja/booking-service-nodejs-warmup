

export default class ListingController{
    constructor(listingService){
        this.service=listingService;

        this.create=this.create.bind(this)
        this.update=this.update.bind(this)
        this.getAll=this.getAll.bind(this)
        this.getById=this.getById.bind(this)
    }

    async create(req,res,next){

        try{
        
        const ownerId=req.user.id;
        const listing=await this.service.create({
            ...req.body,
            ownerId:ownerId
        });

        res.status(201).json(listing);
        }catch(err){
            next(err)
        }

    }

    async update(req,res,next){
        try{
        const ownerId=req.user.id;
        const listingId=req.params.id

        const updatedListing=await this.service.update(listingId,ownerId,req.body);

        res.status(200).json(updatedListing);

        }catch(err){
            next(err)
        }

    }

    async getAll(req,res,next){
        try{

        
        const listings=await this.service.getAll();

        res.status(200).json(listings);

        }catch(err){
            next(err)
        }

    }

    async getById(req,res,next){
        try{
            const id=req.params.id

            console.log(`"ID:: ${id}`)
            const listing=await this.service.getById(id);

            res.status(200).json(listing);
        }catch(err){
            next(err)
        }
    }
}