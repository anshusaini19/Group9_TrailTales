class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// Specific error classes for different HTTP errors
class NotFoundError extends ApiError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized access") {
        super(message, 401);
    }
}

class BadRequestError extends ApiError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

module.exports = { ApiError, NotFoundError, UnauthorizedError, BadRequestError };
