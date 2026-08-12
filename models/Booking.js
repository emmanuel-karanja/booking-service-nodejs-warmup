import {z} from "zod"

export const CreateBookingSchema = z.object({
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date()
}).superRefine((data, ctx) => {
    const now = new Date();

    if (data.checkIn < now) {
        ctx.addIssue({
            code: "custom",
            path: ["checkIn"],
            message: "checkIn cannot be in the past"
        });
    }

    if (data.checkOut < now) {
        ctx.addIssue({
            code: "custom",
            path: ["checkOut"],
            message: "checkOut cannot be in the past"
        });
    }

    if (data.checkOut <= data.checkIn) {
        ctx.addIssue({
            code: "custom",
            path: ["checkOut"],
            message: "checkOut must be after checkIn"
        });
    }
});

export const UpdateBookingSchema = z.object({
    listingId: z.number().int().positive(),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date()
}).superRefine((data, ctx) => {
    const now = new Date();

    if (data.checkIn < now) {
        ctx.addIssue({
            code: "custom",
            path: ["checkIn"],
            message: "checkIn cannot be in the past"
        });
    }

    if (data.checkOut < now) {
        ctx.addIssue({
            code: "custom",
            path: ["checkOut"],
            message: "checkOut cannot be in the past"
        });
    }

    if (data.checkOut <= data.checkIn) {
        ctx.addIssue({
            code: "custom",
            path: ["checkOut"],
            message: "checkOut must be after checkIn"
        });
    }
});