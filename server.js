import app from "./app.js";
import logger from "./logger.js";

import "dotenv/config";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info("Server started", {
        port: PORT
    });
});