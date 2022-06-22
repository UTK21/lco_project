const mongoose = require('mongoose')
const validator = require('validator')

const bcrypt =require('bcryptjs')
const jwt =require('jsonwebtoken')
const crypto =require('crypto')

const userSchema = new mongoose.Schema({ 
    name : {
        type : String,
        required : [true , 'Please provide a name'], //will throw this error if no name given
        maxlength : [40 , 'name should be of max 40 length']
    },
    email : {
        type : String,
        required : [true , 'Please provide a email'], //will throw this error if no name given
        // @ts-ignore
        validate : [validator.isEmail , 'Please provide email in correct format'],
        unique : true
    },
    password : {
        type : String,
        required : [true , 'Please provide a password'], //will throw this error if no name given
        minlength : [8,'passwor should be atleast 8 characters'],
        select : false //paswsord will not be stored like this, no need to do user.password=undefined
    },
    role : {
        type : String,
        default : 'user',

    },
    // photo : {
    //     id : {
    //         type : String,
            
    //     },
    //     secure_url : {
    //         type : String,
            
    //     },
    // }, 
    forgotPassToken : String,
    forgotPassExpiry : Date,
    createdAt :{
        type : Date,
        default : Date.now,
    },
});

//encrypt password before exporting
//save event,bcrypt takes time soo use async function with next which will pass the value to whatever thing which was happening
//no => as there are no arror in mongodb
// @ts-ignore
//user.pre is a HOOKS
userSchema.pre('save',async function(next)
{  
        if(!this.isModified('password')) //use hash function if path is modified or created in the password attribute only
    {
        return next();
    }
    //this. can access any of the attribute of userSchema
   this.password = await bcrypt.hash(this.password ,10) 
})

//validate the password with passed user password
userSchema.methods.isvalidatedPassword =async function(usersendpassword)
{
     return await bcrypt.compare(usersendpassword,this.password)
};


//tokens by using the usser ids
//create and return jwt tokens
userSchema.methods.getJwtTokens= function()
{
    return jwt.sign({ id : this._id },  
        // @ts-ignore
        process.env.JWT_SECRET,
    {
        expiresIn : process.env.JWT_EXPIRY,
    });
};

// generate forgot password token(just a random string,no token dont use jwt)
userSchema.methods.getForgotPasswordToken = function()
{
    //gnerate a long and random string using crypto
    const forgotToken = crypto.randomBytes(20).toString('hex');
    
    // we are getting a hash-make sure to hash the given password to compare it woth forgottenone
    this.forgotPassToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

    //time of token
    this.forgotPassExpiry = Date.now() + 20 * 60 * 1000;
    return forgotToken
}
module.exports =mongoose.model('User' , userSchema)