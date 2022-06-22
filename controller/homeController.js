const Bigpromise = require('../middleware/BigPromise');

exports.home =Bigpromise(async (req, res) =>
{ 
    //await from db statement
    res.status(200).json({
        success: true,
        greetings:"hello from API",
    });
});

exports.homeDummy = (req,res)=>
{
    res.status(200).json({
        success: true,
        greetings:"dummy route",
    });
};