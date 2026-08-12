import NotFoundError from "../errors/NotFoundError.js"
import UnauthorizedError from "../errors/UnauthorizedError.js"
import ConflictError from "../errors/ConflictError.js"

export default function errorHandler(err,req,res,next){
    console.log("headersSent:", res.headersSent);
    console.log("error:", err);

    if(err instanceof NotFoundError){
        res.status(404).json({
            error:err.message
        });
    }

    if(err instanceof UnauthorizedError){
        res.status(401).json({
            error:err.message
        });
    }

    if(err instanceof ConflictError){
        res.status(409).json({
            error:err.message
        });
    }

    return res.status(500).json({
        error: "Internal Server error"
    })
}