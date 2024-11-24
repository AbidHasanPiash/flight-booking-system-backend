'use strict';

import {model, Schema} from 'mongoose';

const FlightSchema = new Schema({
    flightNumber: { type: String, required: true },
    airline: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureDate: { type: Date, required: true },
    price: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    duration: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const FlightsModel = model('Flights', FlightSchema);

export default FlightsModel;
