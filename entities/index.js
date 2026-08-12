import db from "../database.js";

import User from "./UserEntity.js";
import Listing from "./ListingEntity.js";
import Booking from "./BookingEntity.js";

User.initModel(db);
Listing.initModel(db);
Booking.initModel(db);

User.associate({ User, Listing, Booking });
Listing.associate({ User, Listing, Booking });
Booking.associate({ User, Listing, Booking });

export {
    User,
    Listing,
    Booking
};