const express=require("express")
const router=express.Router();
const authRoute=require("./authRoute")
const categoryRoute=require("./categoryRoute")
const productRoute=require("./productRoute")

router.use("/auth",authRoute)
router.use("/category",categoryRoute);
router.use("/product",productRoute);


module.exports=router