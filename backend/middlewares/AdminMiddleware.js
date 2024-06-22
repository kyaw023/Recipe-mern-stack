const AdminMiddleware = async (req, res, next) => {
  console.log(req.user);
  const isAdmin = req.user.role === "admin";

  if (!isAdmin) {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
};

module.exports = AdminMiddleware;
