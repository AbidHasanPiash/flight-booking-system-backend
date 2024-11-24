import FlightsModel from "../modules/api/flights/flights.model.js";

const generateUniqueFlightNumber = async () => {
    let isUnique = false;
    let newFlightNumber = '';

    while (!isUnique) {
        // Generate a random flight number
        const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a 6-digit random number
        newFlightNumber = `FL${randomNumber}`;

        // Check if the flight number already exists in the database
        const existingUser = await FlightsModel.exists({ flightNumber: newFlightNumber }).lean();
        if (!existingUser) {
            isUnique = true; // If no user with the flight number exists, it's unique
        }
    }

    return newFlightNumber;
};

export default generateUniqueFlightNumber;
