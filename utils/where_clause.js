//base = Product.find();

//bigQ = search=coder&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199&limit=5

//we will handle the wherer clauses in qureey 
//majorly search,pagination, ratings (less then greater to functions)
//all threee will have different methods
class WhereClause{
    constructor (base ,bigQ){
        this.base = base;
        this.bigQ = bigQ;
        
    }
    //search method
    search()
    {
        const searchword = this.bigQ.search ?  {
            name : {
                $regex:this.bigQ.search,
                $options: 'i',
            }
        } : {}

        this.base = this.base.find({...searchword})
        return this;
    }

    
    //method for filtering all the other things in bigQ like gtw lte FILTERING
    filter()
   {  //creating a copy of bigQ as we needto apply regex functions onn it,which are applicable only on strings
    //    const copyQ =this.bigQ   cannot apply this as bigQ is an object may not work aswe have already appluied more functons on it like pager and search
    const copyQ = {...this.bigQ}

    //removing some feilds which will not be tackled in this method i.e already tackled
    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];


    //object into string
    let stringOfCopyQ = JSON.stringify(copyQ);

    //replacing gte,lte with dollars infornt of them
    stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m =>`$${m}`)
    
    //string back to json
    const jsonofCopyQ = JSON.parse(stringOfCopyQ);
    this.base = this.base.find(jsonofCopyQ);
    return this;
   }


    //pagination
    pager(resultperpage)
    {
        let currentpage=1;
        if(this.bigQ.page)//if page is already there in bigQ
        {
            currentpage = this.bigQ.page
        }

        const skipVal = resultperpage*(currentpage-1)

        this.base = this.base.limit(resultperpage).skip(skipVal)
        return this;
    
    }
    
   
}

module.exports = WhereClause;