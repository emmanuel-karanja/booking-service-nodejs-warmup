
import {z} from "zod"

export const CreateListingSchema=z.object({
    title:z.string().min(1),
    location:z.string().min(1),
    description:z.string().min(1),
    pricePerNight:z.number().positive()
})

export const UpdateListingSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  pricePerNight: z.number().positive().optional()
});