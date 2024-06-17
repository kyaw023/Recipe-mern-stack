const express = require("express");
const router = express.Router();

const CommentsController = require("../controllers/CommentsController");

router.post("/:userID/:recipeID", CommentsController.postComments);
router.delete(
  "/:userID/:recipeID/:commentID",
  CommentsController.deleteComments
);
router.patch(
  "/:userID/:recipeID/:commentID",
  CommentsController.updateComments
);
router.get("/:recipeID", CommentsController.getComments);
module.exports = router;
