const express=require("express")
const { signup, verifyOtp, resendOTP, signin, getProfile, updateProfile, userList, forgetpass, resetPassword } = require("../controllers/authControllers")
const router=express.Router()
const multer = require("multer");
const { authMiddleware, roleCheck } = require("../middleware/authMiddleware");
const upload = multer();


router.post("/signup",signup)
router.post("/verify-email",verifyOtp);
route.post("/resendOtp",resendOTP);
router.post("/signin",signin);
router.post("/forget-pass",forgetpass);
router.post("reset-pass",resetPassword);
router.get("/getProfile",authMiddleware,getProfile);
router.put("/updateProfile",authMiddleware,upload.single("avatar"),updateProfile);
router.get("/userlist",authMiddleware, roleCheck(["admin"]) ,userList);


module.exports=router