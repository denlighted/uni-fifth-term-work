import {Injectable, NotFoundException, Query} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {UnitedCategories, UnitedProducts} from "../schemas";
import {Model} from "mongoose";

@Injectable()

export class RestProductService {
    constructor( @InjectModel(UnitedCategories.name) private unitedCategories:Model<UnitedCategories>,
                 @InjectModel(UnitedProducts.name) private unitedProducts:Model<UnitedProducts>) {
    }

    async getAllUnitedCategories(){
        return await this.unitedCategories.find().populate('sources');
    }

    async getAllUnitedProducts(){
        return await this.unitedProducts.find().populate('unitedCategory sources');
    }



    async getUnitedProductBySlug(slug:string){
        const unitedProd = await this.unitedProducts.findOne({slug:slug});

        if(!unitedProd){
            throw new NotFoundException("United products not found");
        }
        return unitedProd;
    }
}