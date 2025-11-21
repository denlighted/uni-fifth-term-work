import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {UnitedProducts} from "../products/schemas";
import {Model} from "mongoose";
import {FavoriteProducts} from "./schemas/favorite-products.schema";
import {FavoriteActionRequest} from "./dto/favorite-action.dto";

@Injectable()
export class FavoritesService {

    constructor(@InjectModel(UnitedProducts.name) private unitedProducts:Model<UnitedProducts>,
                @InjectModel(FavoriteProducts.name) private favoriteProducts:Model<FavoriteProducts>,
                ) {}


    async toggleFavorite(dto:FavoriteActionRequest,userId:string) {
        const {productId} = dto;

        if(!productId){
            throw new NotFoundException("Product not found");
        }

        const existingFavorite  = await this.favoriteProducts.findOne({unitedProduct:productId, userId:userId});
        if(existingFavorite ){
            await this.favoriteProducts.deleteOne({_id: existingFavorite._id});
            return { status: "removed" };
        }

        await this.favoriteProducts.create({
            unitedProduct:productId,
            userId:userId
        });

        return { status: "added" };

    }

    async getUserFavorites(userId:string){

        return this.favoriteProducts.find({ userId }).populate("unitedProduct",{__v:0, _id:0}).lean();
    }

    async isFavorite(userId:string,productId:string):Promise<boolean>{
        const favProd = await this.favoriteProducts.findOne({unitedProduct:productId,userId:userId}).lean();
        return !!favProd;
    }

    async countFavorites(productId:string):Promise<number>{
        return this.favoriteProducts.countDocuments({ unitedProduct: productId });
    }
}
