'use strict';

import { z } from "zod";

import schemaShared from "../../../shared/schema.shared.js";

// Reusable schema parts
const mongooseId = schemaShared.mongooseId;

const airline = z.string().nonempty("Airline is required");
const origin = z.string().nonempty("Origin is required");
const destination = z.string().nonempty("Destination is required");
const departureDate = schemaShared.date;

const price = z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
}).positive("Price must be greater than zero");

const availableSeats = z.number({
    required_error: "Available seats are required",
    invalid_type_error: "Available seats must be a number",
})
    .int("Available seats must be an integer")
    .min(0, "Available seats cannot be negative");

const duration = z.string().nonempty("Duration is required");

// Add Flight Schema
const addNewFlight = z
    .object({
        airline,
        origin,
        destination,
        departureDate,
        price,
        availableSeats,
        duration,
    })
    .strict(); // Disallow additional unexpected keys

// Get Flight By Query Schema
const getFlightByQuery = z
    .object({
        origin: origin.optional(),
        destination: destination.optional(),
        date: departureDate.optional(),
    })
    .strict(); // Disallow additional unexpected keys

// Flight ID Schema
const flightId = z.object({
    id: mongooseId,
}).strict(); // Disallow additional unexpected keys

// Update Flight Schema
const updateFlightById = z
    .object({
        id: mongooseId,
        airline: airline.optional(),
        origin: origin.optional(),
        destination: destination.optional(),
        departureDate: departureDate.optional(),
        price: price.optional(),
        availableSeats: availableSeats.optional(),
        duration: duration.optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: "At least one of 'airline', 'origin', 'destination', 'departureDate', 'price', 'availableSeats', or 'duration' must be provided along with 'id'.",
        }
    );

// Export Flights Schema
const flightsSchema = {
    addNewFlight,
    getFlightByQuery,
    flightId,
    updateFlightById,
};

export default flightsSchema;
