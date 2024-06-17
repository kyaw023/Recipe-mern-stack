const express = require("express");
const RecipesController = require("../controllers/RecepiesController");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const uploadImg = require("../helpers/upload");
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
    body("photo").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("photo must be required");
      }
      if (!req.file.mimetype.startsWith("image")) {
        throw new Error("photo must be image");
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
