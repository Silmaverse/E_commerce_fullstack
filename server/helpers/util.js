const crypto=require('crypto')
const jwt = require('jsonwebtoken');
const cloudinary = require("../configs/cloudinaryConfig");


function validateEmail(email){
    const emailregex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailregex.test(email)
}

const genertaeOTp=()=>{
   return crypto.randomInt(1000,1000).toString();
}

const generateAccessToken=(user)=>{
  return jwt.sign({ 
     _id:user._id,
     email:user.email,
     role:user.role
   }, process.env.JWT_SEC ,{
     expiresIn:"2h"
   });
}

const generateRefreshToken=()=>{
    return jwt.sign({ 
     _id:user._id,
     email:user.email,
     role:user.role
   }, process.env.JWT_SEC ,{
     expiresIn:"15d"
   });
    
}

const uploadToCloudinary = async ({ mimetype, imgBuffer }) => {
  const dataUrl = `data:${mimetype};base64,${imgBuffer.toString("base64")}`;

  const res = await cloudinary.uploader.upload(dataUrl);

  return res.secure_url;
};

const destroyFromCloudinary = (url) => {
  const publicId = url.split("/").pop().split(".").shift();

  cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      console.log("Destroy From Cloudinary:", error);
    }
  });
};


module.exports ={validateEmail,genertaeOTp,generateAccessToken,generateRefreshToken,uploadToCloudinary, destroyFromCloudinary}