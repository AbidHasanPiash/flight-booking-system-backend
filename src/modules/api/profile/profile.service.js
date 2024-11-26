import UsersModel from '../users/users.model.js';
import httpStatusConstants from '../../../constant/httpStatus.constants.js';
import createResponse from "../../../utilities/createResponse.js";
import bcrypt from "bcrypt";

const updateProfile = async (id, data) => {
    // Check if the user exists in the database
    const user = await UsersModel.findById(id);
    if (!user._id) {
        return createResponse(
            httpStatusConstants.NOT_FOUND,
            'No user found.'
        );
    }

    console.log(data)

    if (data.password) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
    }

    console.log(data);

    // Update user in the database
    const updatedUser = await UsersModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedUser) {
        return createResponse(
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Could not update data.'
        );
    }

    // Respond with the updated user
    return createResponse(
        httpStatusConstants.OK,
        'Profile updated successfully.'
    );
}

const profileService = {
    updateProfile
};

export default profileService;
