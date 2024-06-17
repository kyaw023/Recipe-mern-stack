const mongoose = require("mongoose");
const Comments = require("../models/Comments");
const User = require("../models/User");
const Recipes = require("../models/Recipes");
const IdValidators = require("../helpers/IdValidators");
const valueValidators = require("../helpers/valueValidators");
const CommentsController = {
  getComments: async (req, res) => {
    try {
      const recipeID = req.params.recipeID;

      IdValidators(recipeID);

      const recipe = await Recipes.findById(recipeID)
        .populate("comments")
        .populate({
          path: "comments",
          populate: { path: "user", model: "User" },
        });

      valueValidators(recipe);

      return res.status(200).json(recipe.comments);
    } catch (error) {
      return res.status(error.status).json({ msg: error.msg });
    }
  },

  postComments: async (req, res) => {
    try {
      const recipeID = req.params.recipeID;
      const userID = req.params.userID;

      IdValidators(recipeID, userID);

      const recipe = await Recipes.findById(recipeID);

      const user = await User.findById(userID);

      valueValidators(recipe, user);

      const comment = {
        user: user,
        comment: req.body.comment,
      };

      // add comment to recipe

      const newComment = await Comments.create(comment);

      recipe.comments.push(newComment);
      await recipe.save();

      return res.status(200).json(recipe.comments);
    } catch (error) {
      return res.status(error.status).json({ msg: error.msg });
    }
  },

  deleteComments: async (req, res) => {
    try {
      const recipeID = req.params.recipeID;
      const userID = req.params.userID;
      const commentID = req.params.commentID;

      IdValidators(recipeID, userID, commentID);

      const recipe = await Recipes.findById(recipeID).populate("comments");
      const user = await User.findById(userID);
      const comment = await Comments.findById(commentID);

      valueValidators(recipe, user, comment);

      // check if user is the author of the comment
      if (comment.user._id.toString() !== user._id.toString()) {
        return res
          .status(401)
          .json({ msg: "You are not authorized to delete this comment" });
      }

      recipe.comments = recipe.comments.filter((comment) => {
        console.log(comment._id.toString() !== commentID);
        if (comment._id.toString() !== commentID) {
          return comment._id.toString() !== commentID;
        }
      });

      await recipe.save();

      return res.status(200).json(recipe.comments);
    } catch (error) {
      return res.status(error.status).json({ msg: error.msg });
    }
  },

  updateComments: async (req, res) => {
    try {
      const recipeID = req.params.recipeID;
      const userID = req.params.userID;
      const commentID = req.params.commentID;

      const { newComment } = req.body;

      // check id

      IdValidators(recipeID, userID, commentID);

      const recipe = await Recipes.findById(recipeID)
        .populate("comments")
        .populate({
          path: "comments",
          populate: { path: "user", model: "User" },
        });

      const user = await User.findById(userID);

      const comment = await Comments.findById(commentID);

      valueValidators(recipe, user, comment);

      // check if user is the author of the comment
      if (comment.user._id.toString() !== user._id.toString()) {
        return res
          .status(401)
          .json({ msg: "You are not authorized to delete this comment" });
      }

      comment.comment = newComment;
      await comment.save();

      const updatedComments = recipe.comments.map((prev) => {
        if (prev._id.toString() === comment._id.toString()) {
          return { ...prev.toObject(), comment: newComment };
        }
        return prev;
      });
      recipe.comments = updatedComments;

      await recipe.save();

      return res.status(200).json(recipe.comments);
    } catch (error) {
      return res.status(error.status).json({ msg: error.msg });
    }
  },
};

module.exports = CommentsController;
