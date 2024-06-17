const mongoose = require("mongoose");
const Comments = require("../models/Comments");
const User = require("../models/User");
const Recipes = require("../models/Recipes");
const CommentsController = {
  getComments: async (req, res) => {
    try {
      const recipeID = req.params.recipeID;

      if (!mongoose.Types.ObjectId.isValid(recipeID)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }

      const recipe = await Recipes.findById(recipeID)
        .populate("comments")
        .populate({
          path: "comments",
          populate: { path: "user", model: "User" },
        });

      if (!recipe) {
        return res.status(404).json({ msg: "Recipe not found" });
      }

      return res.status(200).json(recipe.comments);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  postComments: async (req, res) => {
    try {
      const recipeID = req.params.recipeID;
      const userID = req.params.userID;

      const recipe = await Recipes.findById(recipeID);

      if (!mongoose.Types.ObjectId.isValid(recipeID)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }

      if (!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({ msg: "Not User Id" });
      }

      if (!recipe) {
        return res.status(404).json({ msg: "Recipe not found" });
      }
      const user = await User.findById(userID);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // create comment object using req.body and user
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
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteComments: async (req, res) => {
    try {
      const recipeID = req.params.recipeID;
      const userID = req.params.userID;
      const commentID = req.params.commentID;

      if (!mongoose.Types.ObjectId.isValid(recipeID)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({ msg: "Not User Id" });
      }

      if (!mongoose.Types.ObjectId.isValid(commentID)) {
        return res.status(400).json({ msg: "Not Comment Id" });
      }

      const recipe = await Recipes.findById(recipeID).populate("comments");
      if (!recipe) {
        return res.status(404).json({ msg: "Recipe not found" });
      }

      const user = await User.findById(userID);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const comment = await Comments.findById(commentID);
      if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
      }

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
      return res.status(500).json({ msg: error.message });
    }
  },

  updateComments: async (req, res) => {
    try {
      const recipeID = req.params.recipeID;
      const userID = req.params.userID;
      const commentID = req.params.commentID;

      const { newComment } = req.body;

      if (!mongoose.Types.ObjectId.isValid(recipeID)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({ msg: "Not User Id" });
      }

      if (!mongoose.Types.ObjectId.isValid(commentID)) {
        return res.status(400).json({ msg: "Not Comment Id" });
      }

      const recipe = await Recipes.findById(recipeID)
        .populate("comments")
        .populate({
          path: "comments",
          populate: { path: "user", model: "User" },
        });

      if (!recipe) {
        return res.status(404).json({ msg: "Recipe not found" });
      }

      const user = await User.findById(userID);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const comment = await Comments.findById(commentID);
      if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
      }

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
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = CommentsController;
