const BigPromise = require("../middleware/BigPromise");
const Product=require('../model/product');
const CustomError = require("../utils/customErrore");
const WhereClause = require("../utils/where_clause");

exports.testProduct =  async(req,res)=>
{
    res.status(200).json({
        success: true,
        greetings:"this is a test for product route",
    });
};

//admin route
exports.AddProduct = BigPromise(async(req,res,next) =>
{
    req.body.user = req.user._id;
    const new_product = await Product.create(req.body)

    res.status(200).json({
        success : true,
        new_product
    })
});

exports.getAllProduct = BigPromise(async(req,res,next)=>{
    
    const resultperpage = 6;

    const total_pro_count = await Product.countDocuments();
    const productsObj =  new WhereClause(Product.find(),req.query).search().filter();

    let products =await productsObj.base
    const filtered_Product_count = products.length

    //to user pager method too
    productsObj.pager(resultperpage);
    products= await productsObj.base.clone()  //.base as we are only changing base in pager method



    res.status(200).json({
        success:true,
        products,
        filtered_Product_count,
        total_pro_count
    })
});

exports.getSingleProduct = BigPromise(async(req,res,next)=>{
    
  const Single_Product = await Product.findById(req.params.id)
  if(!Single_Product)
  {
    return next(new CustomError("No product found by this id",401))
  }
  res.status(200).json({
    success : true , 
    Single_Product
  })
});




//review routes
exports.getOnlyReviewsForOneproduct = BigPromise(async(req,res,next)=>{
   const reviewing_product = Product.findById(req.query.id)
   res.status(200).json({
    success : true,
    // @ts-ignore
    review : reviewing_product.reviews,
   });
  });
exports.addReview = BigPromise(async(req,res,next)=>{
   const {rating , comment ,productId}  = req.body;
   const new_review = {
    user : req.user._id,
    name : req.user.name,
     rating : Number(rating),
     comment
   } 
   const Reviewing_product = await Product.findById(productId);
   const Already_reviewed = Reviewing_product.reviews.find(
    (rev) =>rev.user.toString() === req.user._id.toString() 
   )
    //rev is looping through all the existing reviews 
    //and matches it to the user reviewing in the request
    if(Already_reviewed)  //alredy h review has been made so just update it
    {
       Reviewing_product.reviews.forEach( (rev) =>{
        if(rev.user.toString() === req.user._id.toString())  // finding the exisitng comment the reviewing user has made
        {
            rev.comment = comment;
            rev.rating = rating;
        }
     
       })
        
    }
    else{
        Reviewing_product.reviews.push(new_review);
        Reviewing_product.numberofreview= Reviewing_product.reviews.length

    }

     //adjusting the average ratings
     Reviewing_product.ratings = Reviewing_product.reviews.reduce((acc ,item ) => item.rating+acc,0)/Reviewing_product.reviews.length

     await Reviewing_product.save({validateBeforeSave:false})

     req.status(200).json({
        success:true
     })
  });
exports.daleteReview = BigPromise(async(req,res,next)=>{
const {productId} = req.query  //can also use req.params
const deleting_review = await Product.findById(productId)
const reviews = deleting_review.filter((rev) =>rev.user.toString() === req.user._id.toString())  //will save everything except the given review which has to be deleted
    
const numberofreview = reviews.length
// adjust the ratings
// deleting_review.ratings = deleting_review.reviews.reduce((acc ,item ) => item.rating+acc,0)/deleting_review.reviews.length
const ratings = deleting_review.reviews.reduce((acc ,item ) => item.rating+acc,0)/deleting_review.reviews.length// my method

//updating the data

await Product.findByIdAndUpdate(productId,
    {
        reviews,
        ratings,
        numberofreview,
    },
    {
        new:true,
        runValidators :true,
        useFindAndModify : false
    }
    )
    res.status(200).json({
        success : true,
       })
   });

//admin route
exports.AdmingetAllProducts = BigPromise(async(req,res,next)=>{
   const All_Products= await Product.find()
    
   res.status(200).json({
    success : true,
    All_Products
   })
})

//updating a product
exports.AdminUpdateOneProduct = BigPromise(async(req,res,next)=>{
    let updating_product = await Product.findById(req.params.id);
    if(!updating_product)
    {
        return next(new CustomError("No product found by this id",401))
    }

     updating_product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new :true,
        runValidators : true,
        useFindAndModify: false
    })
    res.status(200).json({
        success : true,
        updating_product
    })
 })
//deleting a product
exports.AdminDeleteOneProduct = BigPromise(async(req,res,next)=>{
    const deleting_product = await Product.findById(req.params.id);
    if(!deleting_product)
    {
        return next(new CustomError("No product found by this id",401))
    }
    await deleting_product.remove();
    
    res.status(200).json({
        success : true,
        message: "product was deleted"
    })
 })