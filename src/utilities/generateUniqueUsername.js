import UsersModel from "../modules/api/users/users.model.js";

import generateUniqueID from "./generateUniqueID.js";

const generateUniqueUsername = async (prefix = 'user') => {
    let isUnique = false;
    let newUsername = '';

    while (!isUnique) {
        // Generate a random username
        newUsername = await generateUniqueID(prefix);

        // Check if the username already exists in the database
        const existingUser = await UsersModel.exists({ username: newUsername }).lean();
        if (!existingUser) {
            isUnique = true; // If no user with the username exists, it's unique
        }
    }

    return newUsername;
};

export default generateUniqueUsername;
