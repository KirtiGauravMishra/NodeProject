export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorHandler("Only admins can access this resource", 403));
    }
    next();
};
