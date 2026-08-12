import NotFoundError from "../errors/NotFoundError.js"
import UnauthorizedError from "../errors/UnauthorizedError.js"

export default function errorHandler(err,req,res,next){
    console.error(err);

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

    res.status(500).json({
        error: "Internal Server error"
    })
}