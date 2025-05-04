const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (roles.includes(req.user.role)) {
            console.log("User role verified by customer service");
            return next();
        }

        if (req.user.name && req.user.name === req.params.id) {
            console.log("Self access allowed by customer service");
            return next();
        }

        return res.status(403).json({ message: "Access denied" });
    };
};

module.exports = authorizeRoles;