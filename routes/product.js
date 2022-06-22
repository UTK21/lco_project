const express =require('express');
const router = express.Router();
const { testProduct ,
    AddProduct,
    getAllProduct,
    AdmingetAllProducts,
    getSingleProduct,
    AdminUpdateOneProduct,
    AdminDeleteOneProduct,
    addReview,
    daleteReview,
    getOnlyReviewsForOneproduct,
} = require('../controller/product_controller');


const {isLoggedIn,customRole} = require("../middleware/user") //calling the middleware


//routes
 router.route("/testproduct").get(testProduct);

 //user routes
 router.route("/products").get(getAllProduct); //this can be accessed by anoyone user,admin to handle this we create a similar route for admin too
 router.route("/product/:id").get(getSingleProduct);
 

 //review routes,adding a review are put routes as only changes are being made in the exisitng blank data
 
 router.route("/review").put(isLoggedIn,addReview);
 router.route("/review").delete(isLoggedIn,daleteReview);
 router.route("/review").get(isLoggedIn,getOnlyReviewsForOneproduct);
 


 //admin routes
 router.route("/admin/product/add").post(isLoggedIn,customRole("admin"),AddProduct);
 router.route("/admin/products").get(isLoggedIn,customRole("admin"),AdmingetAllProducts);
 router.route("/admin/product/:id").put(isLoggedIn,customRole("admin"),AdminUpdateOneProduct); //updating a products details
 router.route("/admin/product/:id").delete(isLoggedIn,customRole("admin"),AdminDeleteOneProduct);



module.exports = router;