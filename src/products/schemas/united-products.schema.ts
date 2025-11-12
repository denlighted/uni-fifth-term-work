import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {ScrapedProduct} from "../../scraper/schemas";
import {UnitedCategories} from "./united-categories.schema";

import {Document} from "mongoose";


@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true }})
export class UnitedProducts extends Document {

    @Prop({
        required: [true,"Product got to have a name"],
        minlength:3,
        maxlength:200
    })
    name :string

    @Prop({required: [true,"Product got to have a brand"],maxlength:100})
    brand:string

    @Prop({required: [true,"Product got to have a category"],})
    normalizedName:string // Normalized name for search ????

    @Prop({required: [true,"Product got to have a slug for Url"],})
    slug:string

    @Prop({default: 0})
    ratingsQuantity:number

    @Prop({
        default:4.5,
        min:[1,"Rating must be above 1 "],
        max:[5, "Rating must be below 5"],
        set: val=>Math.round(val*10)/10
    })
    ratingAverage:number

    @Prop({required: [true,"Product got to have a category"],
    type: Types.ObjectId,
    ref: UnitedCategories.name
    })
    unitedCategory : UnitedCategories | Types.ObjectId;

    @Prop({
        type: [{ type: Types.ObjectId, ref: ScrapedProduct.name }]  // Массив с ссылками на документы ScrapedProduct
    })
    sources: ScrapedProduct[] | Types.ObjectId[];  // Ссылаемся на коллекцию ScrapedProduct

}


export const UnitedProductsSchema = SchemaFactory.createForClass(UnitedProducts);

UnitedProductsSchema.virtual("reviews", {
    ref:"Review",
    foreignField: "unitedProduct",
    localField: "_id",
})