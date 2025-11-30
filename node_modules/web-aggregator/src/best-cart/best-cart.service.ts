import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {UnitedProducts} from "../products/schemas";
import {Model} from "mongoose";
import {BestCart} from "./schemas/best-cart.schema";
import {CartedProductsRequest} from "./dto/carted-products.dto";
import {RestProductService} from "../products/services/rest-products.service";
import {ScrapedProduct} from "../scraper/schemas";

@Injectable()
export class BestCartService {
    constructor(@InjectModel(UnitedProducts.name) private unitedProducts:Model<UnitedProducts>,
                @InjectModel(BestCart.name) private bestCart:Model<BestCart>,
                private readonly restProductService:RestProductService
    ) {}

    async toggleCart(userId:string, dto:CartedProductsRequest){

        const {productId} = dto;

        if(!productId){
            throw new NotFoundException("Product not found");
        }

        const existingCartedProd = await this.bestCart.findOne({unitedProduct:productId, userId:userId})

        if(existingCartedProd ){
            await this.bestCart.deleteOne({_id: existingCartedProd._id});
            return { status: "removed" };
        }

        await this.bestCart.create({
            unitedProduct:productId,
            userId:userId
        });

        return { status: "added" };
    }

    async getUserCarted(userId:string){
        return this.bestCart.find({ userId }).populate({
            path: "unitedProduct",
            populate: {
                path: "sources",
                select: "-__v"
            },
            select: "-__v"
        }).lean();
    }

    async isCarted(userId:string,dto:CartedProductsRequest):Promise<boolean>{
        const {productId} =dto
        const cartedProd = await this.bestCart.findOne({unitedProduct:productId,userId:userId}).lean();
        return !!cartedProd;
    }

    async calculateBestBasket(userId: string) {
        const cartedProds = await this.getUserCarted(userId);

        let atbSum = 0;
        let foraSum = 0;

        for (const carted of cartedProds) {
            const product = carted.unitedProduct as UnitedProducts;
            const sources = product.sources as ScrapedProduct[];

            for (const source of sources) {
                if (source.store === "ATB") {
                    atbSum += source.price || 0;
                }
                if (source.store === "Fora") {
                    foraSum += source.price || 0;
                }
            }
        }

        const bestStore = atbSum < foraSum ? "ATБ" : "Fora";
        const bestPrice = atbSum < foraSum ? atbSum : foraSum;
        const worstStore = atbSum < foraSum ? "Fora" : "AТБ";
        const worstPrice = atbSum < foraSum ? foraSum : atbSum;

        return {
            atbSum,
            foraSum,
            bestStore,
            bestPrice,
            message:`Most profitable shop for your cart is ${bestStore} (${bestPrice.toFixed(2)} uah)`,
            secondVar:`The price at ${worstStore} is ${worstPrice.toFixed(2)} uah `
        };
    }

}


