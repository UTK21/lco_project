const User =require('../model/User');
const BigPromise =require('../middleware/BigPromise');
const CustomError =require('../utils/customErrore');
const jwt =require('jsonwebtoken')

//basic idea is to place this file somweherr in the midddle
// check user logggin and inject the user id into the rersquest by using jwt
exports.isLoggedIn =  BigPromise(async (req,res,next)=>{
    var token = req.cookies.token ;
    
    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    if(!token)
    {
    return next(new CustomError("loggin in first to access this page", 401));
    }
   // @ts-ignore
   
   const decoded = jwt.verify(token, process.env.JWT_SECRET)
   //console.log(decoded)
   req.user = await User.findById(decoded.id)
   
  next();
})


exports.customRole = (...roles) => {
return (req,res,next) =>{
  if(!(roles.includes(req.user.role)))
  { 
      return next(new CustomError("you are not aloowed for this path",403))
  }
  next();
}
}
