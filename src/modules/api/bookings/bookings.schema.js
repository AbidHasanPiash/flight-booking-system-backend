'use strict';

import { z } from "zod";

import schemaShared from "../../../shared/schema.shared.js";

// Reusable schema parts
const mongooseId = schemaShared.mongooseId;

const numberOfSeats = z.number({
    required_error: "Number of seats is required",
    invalid_type_error: "Number of seats must be a number",
})
    .int("Number of seats must be an integer")
    .positive("Number of seats must be greater than zero");

const totalPrice = z.number({
    required_error: "Total price is required",
    invalid_type_error: "Total price must be a number",
}).positive("Total price must be greater than zero");

const status = z.enum(["confirmed", "cancelled"]).default("confirmed");
const bookingDate = schemaShared.date;

const addNewBooking = z.object({
    userId: mongooseId,
    flightId: mongooseId,
    numberOfSeats,
    totalPrice,
    status,
    bookingDate: schemaShared.date,
}).strict();

const getBookingByQuery = z
    .object({
        origin: z.string().nonempty("Origin is required").optional(),
        destination: z.string().nonempty("Destination is required").optional(),
        date: schemaShared.date.optional(),
    })
    .strict();

const bookingId = z.object({
    id: mongooseId,
}).strict();

const updateBookingById = z.object({
    id: mongooseId,
    userId: mongooseId.optional(),
    flightId: mongooseId.optional(),
    numberOfSeats: numberOfSeats.optional(),
    totalPrice: totalPrice.optional(),
    status: status.optional(),
    bookingDate: bookingDate.optional(),
})
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        { message: "At least one of 'userId', 'flightId', 'numberOfSeats', 'totalPrice', 'status', or 'bookingDate' must be provided along with 'id'." }
    );

const bookingsSchema = {
    addNewBooking,
    getBookingByQuery,
    bookingId,
    updateBookingById,
};

export default bookingsSchema;
