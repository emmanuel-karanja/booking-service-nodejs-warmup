
import logger from "../logger.js"

export default function requestLogger(req,res,next){
    const start=Date.now();

    res.on("finish",()=>{
        logger.info("HTTP request", {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - start
        });
    });
    next();
}