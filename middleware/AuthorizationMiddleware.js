export function hostOnly(req, res, next) {
    if (req.user.role.toUpperCase() !== "HOST") {
        return res.status(403).json({
            error: "Action can only be performed by a Host user type."
        });
    }

    next();
}

export function guestOnly(req, res, next) {
    if (req.user.role.toUpperCase() !== "GUEST") {
        return res.status(403).json({
            error: "Action can only be performed by a Guest user type."
        });
    }

    next();
}