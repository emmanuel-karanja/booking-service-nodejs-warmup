import express from "express";

import listingRoutes from "./routes/ListingRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import userRoutes from "./routes/UserRoutes.js"
import requestLogger  from "./middleware/LoggingMiddleware.js";
import errorHandler  from "./middleware/GlobalErrorHandler.js";

import "dotenv/config";

import db from "./database.js"


const app = express();

app.use(express.json());

app.use(requestLogger);

app.use("/api", listingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", userRoutes);

// Error middleware must be last.
app.use(errorHandler);

export default app;