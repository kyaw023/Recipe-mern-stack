const express = require("express");
const RecipesController = require("../controllers/RecepiesController");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const uploadImg = require("../helpers/upload");
const Recipes = require("../models/Recipes");
const {
  getRecipes,
  getSingleRecipes,
  postRecipes,
  updateRecipes,
  deleteRecipes,
  upload,
} = RecipesController;

const router = express.Router();

router.get("", getRecipes);
router.get("/search", RecipesController.searchRecipes);
router.post(
  "",
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("ingredients").notEmpty().isArray({ min: 3 }),
    body("instructions").notEmpty().isArray({ min: 3 }),
  ],
  handleErrorMessage,
  postRecipes
);
router.post(
  "/:id/upload",
  [
    uploadImg.single("photo"),
    body("photo").custom(async (value, { req }) => {
      const recipeId = req.params.id; // Get recipe ID from request parameters
      if (!req.file) {
        const recipe = await Recipes.findById(recipeId);
        if (!recipe || !recipe.photo) {
          throw new Error("Photo must be required");
        }
      } else {
        if (!req.file.mimetype.startsWith("image")) {
          throw new Error("Photo must be an image");
        }
      }
      return true;
    }),
  ],
  handleErrorMessage,
  upload
);
router.get("/:id", getSingleRecipes);
router.delete("/:id", deleteRecipes);
router.patch("/:id", updateRecipes);

module.exports = router;
