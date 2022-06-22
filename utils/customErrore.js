class customError extends Error{
    //constructor is a bit of an overkill not usefull
    constructor(message , code)
    {
        super(message)
        this.code =code
    }

}
module.exports=customError