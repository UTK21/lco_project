const express =require('express')
const router = express.Router();

const {isLoggedIn,customRole} = require("../middleware/user") //calling the middleware

const { signup,login,logout,forgotPassword,forgotPasswordReset ,getLoggedInUserDeails ,ChangePassword ,change_user_details,adminALLUser,ManagerALLUser,admingetoneUser,admin_update_oneuser_details,admin_delete_user}=require ('../controller/userController');

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/forgotPassword").post(forgotPassword);

router.route("/password/reset/:token").post(forgotPasswordReset);

router.route("/Userdashboard").get(isLoggedIn ,getLoggedInUserDeails);

router.route("/password/update").post(isLoggedIn,ChangePassword);

router.route("/userdashboard/update").post(isLoggedIn,change_user_details);





router.route("/admin/users").get(isLoggedIn,customRole("admin"),adminALLUser);

//getting details of a user
router.route("/admin/users/:id").get(isLoggedIn,customRole("admin"),admingetoneUser);

//to change details od a user
router.route("/admin/users/:id").put(isLoggedIn,customRole("admin"),admin_update_oneuser_details);

//route to delete
// router.route("/admin/users/:id").delete(isLoggedIn,customRole("admin"),admin_delete_user);



//manager route
router.route("/manager/users").get(isLoggedIn,customRole("manager"),ManagerALLUser);
module.exports = router;