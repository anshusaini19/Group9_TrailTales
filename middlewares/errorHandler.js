const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error for debugging

    // Use existing status code if available, otherwise default to 500
    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: statusCode === 500 ? "Internal Server Error" : "Error",
        message: err.message || "Something went wrong",
    });
};

module.exports = errorHandler;
