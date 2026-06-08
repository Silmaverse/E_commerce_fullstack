const { createProduct } = require("../controllers/ProductController");
const { authMiddleware, roleCheck } = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer();

const route = require("express").Router();

route.post(
  "/create",
  authMiddleware,
  roleCheck(["admin", "moderator"]),
  upload.fields([{ name: "thumbnail", maxcount: 1 },{name:"images",maxcount:4}]),
  createProduct,
);

module.exports = route;
