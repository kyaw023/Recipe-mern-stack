const valueValidators = (recipe, user, comment) => {
  if (recipe) {
    if (!recipe) {
      throw { status: 404, msg: "Recipe not found" };
    }
  }

  if (user) {
    if (!user) {
      throw { status: 404, msg: "User not found" };
    }
  }

  if (comment) {
    if (!comment) {
      throw { status: 404, msg: "comment not found" };
    }
  }
};

module.exports = valueValidators;
