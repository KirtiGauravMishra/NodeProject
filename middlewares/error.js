class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
  
    switch (err.name) {
      case "CastError":
        err = new ErrorHandler(`Resource not found. Invalid ${err.path}`, 400);
        break;
      case 11000:
        err = new ErrorHandler(`Duplicate ${Object.keys(err.keyValue)} Entered`,400);
        break;
      case "JsonWebTokenError":
        err = new ErrorHandler(`Json Web Token is invalid, Try again!`, 401);
        break;
      case "TokenExpiredError":
        err = new ErrorHandler(`Json Web Token is expired, Try again!`, 401);
        break;
      case "ValidationError":
        const errors = Object.values(err.errors).map((val) => val.message);
        err = new ErrorHandler(`Validation Error: ${errors.join(", ")}`, 400);
        break;
      case "SyntaxError":
        err = new ErrorHandler(`Syntax Error: ${err.message}`, 400);
        break;
      case "ReferenceError":
        err = new ErrorHandler(`Internal Server Error: ${err.message}`, 500);
        break;
      case "RangeError":
        err = new ErrorHandler(`Range Error: ${err.message}`, 400);
        break;
      case "TypeError":
        err = new ErrorHandler(`Type Error: ${err.message}`, 400);
        break;
      case "URIError":
        err = new ErrorHandler(`URI Error: ${err.message}`, 400);
        break;
      case "TimeoutError":
        err = new ErrorHandler(`Request Timeout Error: ${err.message}`, 408);
        break;
        case "MongoError":
            const mongoErrorCode = err.code;
            let mongoErrorMessage = "MongoDB Error";
      
            if (mongoErrorCode === 11000) {
              mongoErrorMessage = `Duplicate key error: ${err.keyValue}`;
            } else {
              // Handle other Mongo errors here
            }
      
            err = new ErrorHandler(mongoErrorMessage, 400);
            break;
       case "NetworkError":
        err = new ErrorHandler(`Network Error: ${err.message}`, 500);
        break;
       case "FilesystemError":
        err = new ErrorHandler(`File System Error: ${err.message}`, 500);
        break;
       case "HttpError":
        err = new ErrorHandler(`HTTP Error: ${err.statusCode}`, err.statusCode);
        break;
      default:
        break;
    }
  
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  };
  
  export default ErrorHandler;
  