const crypto=require('crypto')
const jwt = require('jsonwebtoken');


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

module.exports ={validateEmail,genertaeOTp,generateAccessToken,generateRefreshToken}