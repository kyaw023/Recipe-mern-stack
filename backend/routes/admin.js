const express = require("express");
const AdminController = require("../controllers/AdminController");

const router = express.Router();

router.get("/users", AdminController.getUsers);
router.get("/recipes", AdminController.getRecipes);

module.exports = router;
