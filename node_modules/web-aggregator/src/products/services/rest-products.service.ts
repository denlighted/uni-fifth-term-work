import {BadRequestException, Injectable, NotFoundException, Query} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {UnitedCategories, UnitedProducts} from "../schemas";
import {Model} from "mongoose";
import {QueryBuilder} from "../../utils/query-builder";
import {ProductFilterDto} from "../../common/dto/product-filter.dto";
import {BaseQueryDto} from "../../common/dto/query.dto";

@Injectable()

export class RestProductService {
    constructor( @InjectModel(UnitedCategories.name) private unitedCategories:Model<UnitedCategories>,
                 @InjectModel(UnitedProducts.name) private unitedProducts:Model<UnitedProducts>) {
    }

    async getAllUnitedCategories(){
        return await this.unitedCategories.find().populate('sources');
    }

    async getAllUnitedProducts(queryDto:any){
        const query = this.unitedProducts.find().populate('unitedCategory sources');

        return new QueryBuilder(queryDto,query)
            .filter()
            .sorting()
            .pagination()
            .limiting()
            .build();
    }



    async getUnitedProductBySlug(slug:string){
        console.log(slug);
        const unitedProd = await this.unitedProducts.findOne({slug:slug}).populate('sources unitedCategory',{__v:0}).select({__v:0, id:0});

        if(!unitedProd){
            throw new NotFoundException("United products not found by slug");
        }
        return unitedProd;
    }


    async getUnitedProductById(id: string) {
        console.log('Searching for id:', id);

        const unitedProd = await this.unitedProducts.findById(id).populate('reviews');

        if (!unitedProd) {
            throw new NotFoundException('United product not found by id');
        }

        return unitedProd;
    }

    async deleteProductById(id:string){
        return this.unitedProducts.deleteOne({_id: id});
}
}