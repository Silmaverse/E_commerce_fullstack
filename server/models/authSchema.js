const { default: mongoose } = require('mongoose');
const { Schema } = mongoose;
const bcrypt=require('bcrypt');

const userSchema= new Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
       type:String,
       required:true,
       unique:true 
    },
    password:{
       type:String,
       required:true,
       select:false 
    },
    avatar:{
        type:String
    },
    address:{
       type:String 
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
        default:null,
    },
    otpexpiry:{
        type:Date,
    },
     resetToekn:{
        type:String,
        default:null,
    },
    resetToeknexpiry:{
        type:Date,
    },
    role:{
       type:String,
       required:true,
       default:"user",
       enum:["user","admin","moderator"] 
    },
},{timestaps:true})

userSchema.pre('save',async function(req,res) {
  if (!this.isModified("password")) return;
  try{
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  }catch(err){
    res.status(500).send({message:"Server Error"})
  }
});

userSchema.methods.comparePassword =async function (plainpass){
    // result == false
    return await bcrypt.compare(plainpass,this.password)
};

module.exports=mongoose.model('user',userSchema)