const express = require("express");
const UserController = require("../controllers/UserController");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const User = require("../models/User");
const AuthMiddleWare = require("../middlewares/AuthMiddleware");

const router = express.Router();
router.get("/me", AuthMiddleWare, UserController.me);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.patch("/edit/:id", UserController.editProfile);
router.get("/:userId/favorites", UserController.getFavorites);
router.post("/:userId/favorites", UserController.postFavorites);
router.delete("/:userId/favorites/:id", UserController.removeFavorites);

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").notEmpty(),
    body("email").custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("E-mail already existed");
      }
    }),
    body("password").notEmpty().isLength({ min: 8 }),
  ],
  handleErrorMessage,
  UserController.register
);

module.exports = router;
