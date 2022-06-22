const mongoose = require('mongoose');


const connetWithDb = () =>{
   // @ts-ignore
   mongoose.connect(process.env.DB_URL ,
    {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
   // @ts-ignore
   .then( console.log("db connected seccessfully"))
   .catch(error => 
    {
        console.log("DB connecteion issues");
        console.log(error);
        process.exit(1);
    })
};
module.exports = connetWithDb