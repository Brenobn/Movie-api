const { Router } = require("express");
const multer = require("multer");

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router();
const upload = multer();

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);

module.exports = usersRoutes;