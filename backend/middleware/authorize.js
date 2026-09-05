module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: 'Authorization required' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ msg: 'Forbidden' });
    next();
  };
};
