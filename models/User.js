import {z} from "zod"

export const CreateUserSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8),
    role: z.enum(["GUEST", "HOST"])
})


export const LoginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8)
})