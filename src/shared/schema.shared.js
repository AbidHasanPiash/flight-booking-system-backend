import {z} from "zod";

import constants from "../constant/constants.js";

const mongooseId = z.string()
    .nonempty("Booking ID is required")
    .regex(constants.mongooseIdRegex, "Invalid booking ID");

const date = z
    .string()
    .nonempty("Date is required")
    .transform((val) => {
        const parsedDate = new Date(val);
        if (isNaN(parsedDate.getTime())) {
            throw new Error("Invalid date format");
        }
        return parsedDate;
    });

const schemaShared = {
    mongooseId,
    date,
};

export default schemaShared;
