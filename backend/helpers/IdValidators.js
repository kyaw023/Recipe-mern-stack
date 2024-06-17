const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const IdValidators = (recipeID, userID, commentID) => {
  if (recipeID) {
    if (!isValidObjectId(recipeID)) {
      throw { status: 400, msg: "Not valid id" };
    }
  }
  if (userID) {
    if (!isValidObjectId(userID)) {
      throw { status: 400, msg: "Not valid userID" };
    }
  }
  if (commentID) {
    if (!isValidObjectId(commentID)) {
      throw { status: 400, msg: "Not valid commentID" };
    }
  }
};

module.exports = IdValidators;
