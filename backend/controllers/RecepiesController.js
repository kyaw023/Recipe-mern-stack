const removeFile = require("../helpers/removeFile");
const Recipes = require("../models/Recipes");
const mongoose = require("mongoose");
const User = require("../models/User");
const emailQueue = require("../queues/emailQueues");

const RecipesController = {
  getRecipes: async (req, res) => {
    try {
      const limit = 6;
      const page = req.query.page || 1;

      const recipes = await Recipes.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createAt: -1 });
      const totalRecipes = await Recipes.countDocuments();
      const totalPages = Math.ceil(totalRecipes / limit);

      const links = {
        nextPage: page == totalPages ? false : true,
        previousPage: page == 1 ? false : true,
        currentPage: page,
        paginationLinks: [],
      };

      for (let index = 0; index < totalPages; index++) {
        links.paginationLinks.push({ number: index + 1 });
      }

      const response = {
        links,
        data: recipes,
      };
      return res.json(response);
    } catch (e) {
      return res.json({ msg: "No Recipes" });
    }
  },
  searchRecipes: async (req, res) => {
    try {
      const searchQuery = req.query?.q || "";

      const searchCondition = searchQuery
        ? {
            $or: [
              { title: { $regex: searchQuery, $options: "i" } },
              { description: { $regex: searchQuery, $options: "i" } },
            ],
          }
        : {};
      const recipes = await Recipes.find(searchCondition);

      return res.json(recipes);
    } catch (error) {
      return res.status(404).json({ msg: "recipes not found" });
    }
  },
  postRecipes: async (req, res) => {
    try {
      const {
        title,
        description,
        ingredients,
        instructions,
        servings,
        prep_time,
        cook_time,
      } = req.body;
      const recipe = await Recipes.create({
        title,
        description,
        ingredients,
        instructions,
        servings,
        prep_time,
        cook_time,
      });

      const users = await User.find(null, ["email"]);

      const emails = users.map((user) => user.email);

      const filterEmails = emails.filter((email) => email !== req.user.email);

      emailQueue.add({
        path: "email",
        data: {
          name: req.user.name,
          recipe,
        },
        from: req.user.email,
        to: filterEmails,
        subject: `New Recipe is created by ${req.user.name}`,
      });

      return res.json(recipe);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ msg: "Invalid Field" });
    }
  },

  getSingleRecipes: async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }
      const singleRecipe = await Recipes.findById(id);
      if (!singleRecipe) {
        return res.status(404).json({ msg: "No Recipe Found!" });
      }
      return res.json(singleRecipe);
    } catch (error) {
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },

  updateRecipes: async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }
      const existedRecipe = await Recipes.findById(id);
      console.log(existedRecipe, req?.file?.filename);
      if (existedRecipe?.photo && req?.file?.filename) {
        await removeFile(__dirname + "/../public" + existedRecipe.photo);
      }
      const recipe = await Recipes.findByIdAndUpdate(id, req.body);

      if (!recipe) {
        return res.status(404).json({ msg: "No Recipe Found!" });
      }
      return res.json(recipe);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },

  deleteRecipes: async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }
      const deleteRecipes = await Recipes.findByIdAndDelete(id);
      await removeFile(__dirname + "/../public" + deleteRecipes.photo);
      if (!deleteRecipes) {
        return res.status(404).json({ msg: "No Recipe Found!" });
      }
      return res.json(deleteRecipes);
    } catch (error) {
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },

  upload: async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }

      const existedRecipe = await Recipes.findById(id);

      if (existedRecipe?.photo && req?.file?.filename) {
        await removeFile(__dirname + "/../public" + existedRecipe.photo);
      }
      const recipe = await Recipes.findByIdAndUpdate(id, {
        photo: "/" + req.file.filename,
      });

      if (!recipe) {
        return res.status(404).json({ msg: "No Recipe Found!" });
      }
      return res.json(recipe);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },
};

module.exports = RecipesController;
