

export default class UserController{
    constructor(userService){
        this.service=userService;

        this.login=this.login.bind(this)
        this.register=this.register.bind(this)
    }

    async login(req,res,next){
       try{

        const email=req.body.email;
        const password=req.body.password
        const user=await this.service.login(email,password);

        res.status(200).json(user);
        }catch(err){
            next(err)
        }
    }

    async register(req,res,next){
        try{
        
        const user=await this.service.register(req.body);

        res.status(201).json(user);
        }catch(err){
            next(err)
        }
    }
}