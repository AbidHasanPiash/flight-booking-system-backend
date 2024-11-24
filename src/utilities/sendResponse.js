const sendResponse = (res, status, message, data = {}) => {
    res.status(status).json({
        timestamp: new Date(),
        status,
        message,
        data,
    });
};

export default sendResponse;
