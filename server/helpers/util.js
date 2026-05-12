const crypto=require('crypto')

function validateEmail(email){
    const emailregex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailregex.test(email)
}

const genertaeOTp=()=>{
   return crypto.randomInt(1000,1000).toString();
}


module.exports ={validateEmail,genertaeOTp}