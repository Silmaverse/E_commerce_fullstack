const { mailSender } = require("../helpers/mailService");
const { OTPMailTemp } = require("../helpers/mailTemplate");
const { genertaeOTp } = require("../helpers/util");
const userschema=require("../models/authSchema")
console.log(genertaeOTp)
const signup=async(req,res)=>{
    const {fullname,email ,passowrd}=req.body;
    try{
       if(!fullname) return res.status(400).send({message:"Fullname is required"}) 
       if(!email) return res.status(400).send({message:"Email is required"}) 
       if(!passowrd) return res.status(400).send({message:"Password is required"}) 
       const existemail=await userschema.find({email})
       if(existemail) return res.status(400).send({message:"This email alreday exist"})
       const otp=genertaeOTp();
       const user= new userschema({
        fullname, 
        email,
        password,
        otp,
        otpexpiry:Date.now()+5*60*1000

       })

       await user.save()
       mailSender({
         email,
         subject:"Verify your Otp",
         template:OTPMailTemp(otp)
       })
       res.status(200).send({message:"Registration successfully verify your mail"})
    }catch(err){
        console.log(err)
        res.status(500).send({message:"Internal server Error"})
    }
}


module.exports={signup}