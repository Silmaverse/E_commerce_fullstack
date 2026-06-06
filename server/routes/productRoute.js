const { createProduct } = require("../controllers/ProductController");
const { authMiddleware, roleCheck } = require("../middleware/authMiddleware");

const route=require("express").Router();

route.post("/create",authMiddleware,roleCheck(["admin","moderator"]),createProduct);

module.exports=route;