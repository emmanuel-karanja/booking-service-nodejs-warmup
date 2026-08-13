import {Listing} from "../entities/index.js"

import NotFoundError from "../errors/NotFoundError.js"

export default class ListingService{

    async create(data){
        // Creation logic is a little too thin.
       return Listing.create(data);
    }

    async getById(listingId) {
        const listing = await Listing.findOne({
            where: {
                id: listingId
            }
        });

        if (!listing) {
            throw new NotFoundError("Listing not found");
        }

        return listing;
    }

    async getAll(){
        return Listing.findAll();
    }

    async update(id, ownerId, data) {
        const listing = await Listing.findOne({
            where: {
                id
            }
        });

        if (!listing) {
            throw new NotFoundError("Listing not found");
        }

        return listing.update(data);
    }
}