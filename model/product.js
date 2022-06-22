const mongoose = require('mongoose')
const productSchema= new mongoose.Schema({
 name : {
    type : String,
    required : [true , 'please provide prodcut name'],
    trim : true,
    maxlength : [120,'max product name allowed is 120 characters'],
 },
 price : {
    type : Number,
    required : [true , 'please provide prodcut price'],
    maxlength : [5,'max product price is 5  digits'],
 },
 description : {
    type : String,
    required : [true , 'please provide prodcut description'],
    trim : true,
 },
 category : {
    type : String,
    required : [true , 'please select  category from - short-sleeves,long-sleeves,sweat-shirts,hoodies'],
    enum:{
        values:[
            'shortsleeves',
            'longsleeves',
            'sweatshirts',
            'hoodies'
        ],
        message: "please select  category ONLY from - short-sleeves,long-sleeves,sweat-shirts,hoodies",
    },
 },
 brand : {
    type: String,
    required: [true,'please provide a brand name']
 },
 ratings : {
    type: Number,
    default : 0
 },
 numberofreview : {
    type: Number,
    default : 0
 },
 reviews : [
    {
        user : {
            // @ts-ignore
            type : mongoose.Schema.ObjectId,
            ref : 'User',
            required : true
        },
        name :{
            type : String,
            required: true,
        },
        rating :{
            type : Number,
            required:true,
        },
        commnet :{
            type : String,
            required:true,
        },
    }
 ],
 user: { //who added this perticular product
        // @ts-ignore
        type :mongoose.Schema.ObjectId,
        ref : "User",
        required : true
 },
 createdAt : {
    type : Date,
    default : Date.now,
 },
})





module.exports= mongoose.model('Product', productSchema)
