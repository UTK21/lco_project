const User =require('../model/User');
const BigPromise =require('../middleware/BigPromise');
const CustomError =require('../utils/customErrore');
const cookieToken =require('../utils/cookieToken');
const mailHelper = require("../utils/email_helper");
const crypto = require('crypto');
const { json } = require('express');


exports.signup = BigPromise(async (req ,res ,next) => {
    const {name ,email ,password} =req.body

    if(!(email || name || password))
    {
        return next(new CustomError('please send name email and password',400))
    }
   const new_user= await User.create({
        name,
        email,
        password,
    });
  cookieToken(new_user ,res);
});

exports.login = BigPromise(async ( req ,res,next) =>
{
  const {email ,password} = req.body;

  //chechk for presence of email and pasword
  if(!(email || password))
  {
    return next(new CustomError('please provide email and password',400));
  }
  //get user with email id from db
   const comparing_user= await User.findOne({email}).select("+password")
   
   //if user is not regitered
   if(!comparing_user)
  {
    return next(new CustomError('email or password does not match',401));
  }

  //getting the password from db
  const isPasswordcorrect =await  comparing_user.isvalidatedPassword(password);
  //matching the password
  if(!isPasswordcorrect)
  {
    return next(new CustomError('email or password does not match',401));
  }
  //if everything is fine and token is sent
  cookieToken(comparing_user ,res);
});

exports.logout = BigPromise(async ( req ,res,next) =>
{
  res.cookie('token',null, 
  {
    expires: new Date(Date.now()),
    httpOnly :true,
  })
  res.status(200).json({
    success :true,
    message: "logout is successull"
  })
});

exports.forgotPassword = BigPromise(async ( req ,res,next) =>
{
    const {email}=req.body;

    const forgot_pass_user= await User.findOne({email})

    const forgot_token= forgot_pass_user.getForgotPasswordToken()
    if(!forgot_pass_user)
    {
      return next(new CustomError("user not registered" ,400 ))
    }

    await forgot_pass_user.save({validateBeforeSave: false})

   //crafting the url to be sent
    const my_url = `${req.protocol}://${req.get("host")}/api/v1/pasword/reset/${forgot_token}`

    const message = `copt paste this link in your url and hit enter \n \n \n  ${my_url}`

    try {
       await mailHelper({
        email : forgot_pass_user.email,
        subject : "T-shirt store password reset email",
        message,
       });

       res.status(200).json({
        success : true , 
        mesage : "email sent successfully",
       })
    } catch (error) {
       forgot_pass_user.forgotPassToken = undefined
       forgot_pass_user.forgotPassExpiry = undefined
       await forgot_pass_user.save({validateBeforeSave: false})

       return next(new CustomError(error.message , 500));
    }
});


exports.forgotPasswordReset = BigPromise(async ( req ,res,next) =>
{
     const token =req.params.token;
     const encryptedToken = crypto
     .createHash("sha256")
     .update(token)
     .digest("hex");

    const forgot_password_user =await User.findOne({
      encryptedToken,
      forgotPassExpiry : {$gt: Date.now()}
     })

     if(!forgot_password_user)
     {
       return next(new CustomError("token in invalid or expired",401))
     }

     if(req.body.Password != req.body.ConfirmPassword)
     {
      return next(new CustomError("passwords do not match",401))
     }

     forgot_password_user.password = req.body.Password;
     forgot_password_user.forgotPassToken = undefined;
     forgot_password_user.forgotPassExpiry = undefined;

     await forgot_password_user.save();

     //send a json response or send token
     cookieToken(forgot_password_user ,res);
});
exports.getLoggedInUserDeails = BigPromise(async ( req ,res,next) =>
{    // console.log(req.user);
    const user_logged_in = await User.findById(req.user._id); //injected by user middleware;
   
    res.status(200).json({
      success: true,
      user_logged_in
    })
});

exports.ChangePassword = BigPromise(async ( req ,res,next) =>
{ 
  const userId = req.user._id;  //middleware
  
  const user = await User.findById(userId).select("+password")
  
  const Is_correct_old_pass = await user.isvalidatedPassword(req.body.oldPassword)
  
 if(!Is_correct_old_pass)
 {
  return next(new CustomError("incorrect old password",400))
 }
 user.password =req.body.password
 
 await user.save();

 cookieToken(user , res);
});



exports.change_user_details =  BigPromise(async (req,res,next)=>{
  
  const newData= {
    name :req.body.name,
    email: req.body.email
  };


const user = await User.findByIdAndUpdate(req.user._id,newData ,{
  new : true,
  runValidators: true,
  useFindAndModify: false,
});

res.status(200).json({
  success : true,
  user
})
})


exports.adminALLUser =  BigPromise(async (req,res,next)=>{
  const Allusers= await User.find()
  res.status(200).json({
    success :true,
    Allusers
  })

})

//admin extracting single user
exports.admingetoneUser =  BigPromise(async (req,res,next)=>{
const required_user = await User.findById(req.params.id)

if(!required_user)
{
  return next (new CustomError("no user found",400));
}
res.status(200).json({
  success : true ,
  required_user
})

})


exports.admin_update_oneuser_details =  BigPromise(async (req,res,next)=>{
  
  const newData= {
    name :req.body.name,
    email: req.body.email,
    role : req.body.role
  };
const user = await User.findByIdAndUpdate(req.params.id,newData ,{
  new : true,
  runValidators: true,
  useFindAndModify: false,
})
});



exports.admin_delete_user =  BigPromise(async (req,res,next)=>{
 const deleting_user = await User.findById(req.params.id)
 
 if(!deleting_user)
 {
   return next (new CustomError("no user found to delete",401));
 }
 
 await deleting_user.remove();
 
 res.status(200).json({
  success: true
 })
 
});






//will not give addmins to the manager
exports.ManagerALLUser =  BigPromise(async (req,res,next)=>{    
  const Allusers= await User.find({role: "user"})
  res.status(200).json({
    success :true,
    Allusers
  })

})