const IDCheckMiddleware = () => {
  if (!mongoose.Types.ObjectId.isValid(recipeID)) {
    return res.status(400).json({ msg: "Not Valid Id" });
  }
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ msg: "Not User Id" });
  }
  if (!mongoose.Types.ObjectId.isValid(commentID)) {
    return res.status(400).json({ msg: "Not Comment Id" });
  }
};
