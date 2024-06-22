const User = require("../models/User");
const removeFile = require("../helpers/removeFile");
const createToken = require("../helpers/createToken");
const mongoose = require("mongoose");
const Recipes = require("../models/Recipes");

const sendEmail = require("../helpers/sendEmail");

const bcrypt = require("bcrypt");

const UserController = {
  me: async (req, res) => {
    return res.json(req.user);
  },

  editProfile: async (req, res) => {
    try {
      const id = req.params.id;

      const { name, email, bio, role, password } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }
      const existedUser = await User.findById(id);
      const user = await User.updateProfile(
        id,
        name,
        email,
        bio,
        role,
        password
      );

      if (existedUser.photo && req?.file?.filename) {
        await removeFile(__dirname + "/../public" + existedUser.photo);
      }
      if (!user) {
        return res.status(404).json({ msg: "No User Found!" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(401).json({ msg: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const loginUser = await User.login(email, password);
      const token = createToken(loginUser._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      return res.json({ loginUser, token });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await User.register(name, email, password);
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      return res.json({ user, token });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.cookie("jwt", "", {
        maxAge: 1,
      });
      return res.json({ message: "user logout successfully" });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  },

  getFavorites: async (req, res) => {
    try {
      const userId = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }
      const isUserExisted = await User.findById(userId).populate(
        "favoritesRecipes"
      );

      if (!isUserExisted) {
        return res.json({ msg: "Not user found" });
      }
      return res.status(200).json(isUserExisted.favoritesRecipes);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  postFavorites: async (req, res) => {
    try {
      const userId = req.params.userId;

      // get  recipeId
      const { recipeId } = req.body;

      // check user id is valid
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: "Not Valid User Id" });
      }

      // check user is loggin
      const isUserExisted = await User.findById(userId);

      if (!isUserExisted) {
        return res.json({ msg: "Not user found" });
      }

      // check recipe id is valid
      if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        return res.status(400).json({ msg: "Not Valid Recipe Id" });
      }

      //check if recipe is existed in recipes database
      const isRecipeExisted = await Recipes.findById(recipeId);

      if (!isRecipeExisted) {
        return res.json({ msg: "No Recipe found" });
      }

      if (isUserExisted.favoritesRecipes?.includes(recipeId)) {
        return res.status(400).json({ msg: "Recipe already in favorites" });
      }

      isUserExisted.favoritesRecipes?.push(recipeId);

      await isUserExisted.save();

      return res.status(200).json(isUserExisted.favoritesRecipes);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  removeFavorites: async (req, res) => {
    try {
      const userId = req.params.userId;
      const recipeId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: "Not Valid User Id" });
      }
      if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        return res.status(400).json({ msg: "Not Valid Recipe Id" });
      }
      const isUserExisted = await User.findById(userId);
      if (!isUserExisted) {
        return res.json({ msg: "Not user found" });
      }

      if (!isUserExisted.favoritesRecipes?.includes(recipeId)) {
        return res.status(400).json({ msg: "Recipe not in favorites" });
      }

      isUserExisted.favoritesRecipes = isUserExisted.favoritesRecipes.filter(
        (fav) => {
          return fav?._id != recipeId;
        }
      );

      await isUserExisted.save();
      return res.status(200).json(isUserExisted.favoritesRecipes);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  uploadPhoto: async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not Valid Id" });
      }

      const existedUser = await User.findById(id);

      if (existedUser.photo && req.file.filename) {
        await removeFile(__dirname + "/../public" + existedUser.photo);
      }

      const user = await User.findByIdAndUpdate(
        id,
        {
          photo: "/" + req.file.filename,
        },
        {
          new: true,
        }
      );

      if (!user) {
        return res.status(404).json({ msg: "No User Found!" });
      }
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },
  requestEmail: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      const resetUrl = `http://localhost:5173/reset-password/${user._id}`;

      sendEmail({
        view: "resetEmail",
        data: {
          userName: user.name,
          resetLink: resetUrl,
        },
        from: "mateam@gmail.com",
        to: email,
        subject: " Password Reset Request",
      });
      return res.json({ msg: "We will sent link to your gmail account" });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ msg: "Invalid Field" });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      const salt = await bcrypt.genSalt();

      const hashCode = await bcrypt.hash(password, salt);
      user.password = hashCode; // Ensure to hash the password before saving
      await user.save();
      return res.json({ msg: "password changed" });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ msg: "Invalid Field" });
    }
  },
};

module.exports = UserController;
