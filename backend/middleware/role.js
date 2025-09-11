// Middleware to check for required role
module.exports = function (requiredRoles) {
  return (req, res, next) => {
    // For admin routes, role is in req.admin
    const user = req.admin || req.user;
    if (!user || !requiredRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};
