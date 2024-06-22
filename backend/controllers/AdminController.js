const Recipes = require("../models/Recipes");
const User = require("../models/User");

const AdminController = {
  getUsers: async (req, res) => {
    const limit = 6;
    const page = req.query.page || 1;

    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

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
      data: users,
    };
    return res.json(response);
  },
  getRecipes: async (req, res) => {
    const limit = 6;
    const page = req.query.page || 1;

    const users = await Recipes.find()
      .populate("createdBy")
      .skip((page - 1) * limit)
      .limit(limit);
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
      data: users,
    };
    return res.json(response);
  },
};

module.exports = AdminController;
