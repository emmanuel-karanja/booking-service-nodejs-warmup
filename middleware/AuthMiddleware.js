

import jwt from "jsonwebtoken";


export default function authenticate(req,res,next){
    const authHeader=req.headers.authorization;

    if(!authHeader?.startsWith("Bearer ")){
        res.status(401).json({
            error:"Authorization required"
        });
    }

    const token=authHeader.split(" ")[1];

    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET);
        req.user=payload;

        next();

    }catch(err){
        res.status(401).json({
            error:"Invalid or expired token"
        })
    }
}