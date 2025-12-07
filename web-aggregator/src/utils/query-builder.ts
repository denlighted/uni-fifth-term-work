import {BaseQueryDto} from "../common/dto/query.dto";
import {ProductFilterDto} from "../common/dto/product-filter.dto";

export class QueryBuilder {

     constructor(private readonly dto:any,
    private  query:any ){}

     filter() {
          // 1) Filtering
          const queryObj = { ...this.dto };
          const excludedFields = ['page', 'sort', 'limit', 'fields'];
          excludedFields.forEach((fields) => {
               delete queryObj[fields];
          });

          if(this.dto.search){
               this.query = this.query.find({
                    $text: { $search: this.dto.search }
               });
          }

          //2) Advanced filtering
          let queryStr = JSON.stringify(queryObj);
          queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

          this.query = this.query.find(JSON.parse(queryStr));

          return this;
     }

     sorting(){
          if(this.dto.sort){
               const sortBy = this.dto.sort.split(',').join(' ');
               this.query =this.query.sort(sortBy);
          }
          else{
               this.query =this.query.select("-__v");
          }
          return this;
     }

     limiting(){
          if(this.dto.fields){
               const fieldsBy = this.dto.fields.split(',').join(' ');
               this.query = this.query.select(fieldsBy)
          }
          else{
               this.query = this.query.select("-__v")
          }

          return this;
     }

     pagination(){
          const page = this.dto.page || 1;
          const limit = this.dto.limit || 50;
          const skippedValue = (page - 1) * limit;

          this.query = this.query.skip(skippedValue).limit(limit);
          return this;
     }


     build(){
          return this.query.exec();
     }

}