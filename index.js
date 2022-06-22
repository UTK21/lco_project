const app =require('./app');
const connetWithDb = require('./config/db');
require('dotenv').config();

//connect with databaase
connetWithDb();

app.listen(process.env.PORT, () =>
{
   console.log(`Server is running at port ${process.env.PORT}`);
});