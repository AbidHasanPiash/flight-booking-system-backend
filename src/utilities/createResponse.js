const createResponse = (status, message, data = {}) => ({
    timestamp: new Date(),
    status,
    message,
    data,
});

export default createResponse;
