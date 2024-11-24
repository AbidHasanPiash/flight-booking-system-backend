import httpStatusConstants from "../constant/httpStatus.constants.js";

import createResponse from "../utilities/createResponse.js";

const getEntityById = async ({ id, model, entityName }) => {
    const entityData = await model.findById(id);

    if (!entityData) {
        return createResponse(
            httpStatusConstants.NOT_FOUND,
            `${entityName} with id ${id} not found.`
        );
    }

    return createResponse(
        httpStatusConstants.OK,
        `${entityName} with id ${id} fetched successfully.`,
        entityData
    );
};

const deleteEntityById = async ({ id, model, entityName }) => {
    const existingEntity = await model.findById(id);
    if (!existingEntity) {
        return createResponse(
            httpStatusConstants.NOT_FOUND,
            `${entityName} with id ${id} not found.`
        );
    }

    const deletedEntity = await model.findByIdAndDelete(id);

    if (!deletedEntity) {
        return createResponse(
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to delete ${entityName} with id ${id} due to a server error.`
        );
    }

    return createResponse(
        httpStatusConstants.OK,
        `${entityName} with id ${id} deleted successfully.`,
        deletedEntity
    );
};

const serviceShared = {
    getEntityById,
    deleteEntityById,
};

export default serviceShared;
