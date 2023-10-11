class ApiFeatutres{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            }
        }:{}        
        this.query = this.query.find({...keyword});
        return this;
    }
    filter(){
        const queryCopy = {...this.queryStr};        
        //reomving some fields for category
        const removefields = ["keyword","page","limit"];
        removefields.forEach(key=>delete queryCopy[key]);
        //filter for price range
        let querystr = JSON.stringify(queryCopy);
        querystr = querystr.replace(/\b(gt|lt|gte|lte)\b/g,(key) =>`$${key}`)                
        this.query = this.query.find(JSON.parse(querystr));
        return this;
    };
    pagiantion(resultPerPage){
        const currentPage = Number(this.queryStr.page);
        const skip = resultPerPage*(currentPage -1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}
module.exports = ApiFeatutres;