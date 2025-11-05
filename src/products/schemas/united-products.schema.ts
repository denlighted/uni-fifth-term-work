import {Prop, Schema} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {ScrapedProduct} from "../../scraper/schemas";
import {UnitedCategories} from "./united-categories.schema";

import {Document} from "mongoose";

@Schema()
export class UnitedProducts extends Document {

    @Prop({
        required: [true,"Product got to have a name"],
        minlength:3,
        maxlength:200
    })
    name :String

    @Prop({required: [true,"Product got to have a brand"],maxlength:100})
    brand:String

    @Prop({required: [true,"Product got to have a category"],})
    normalizedName:String // Normalized name for search ????


    @Prop({required: [true,"Product got to have a category"],
    type: Types.ObjectId,
    ref: UnitedCategories.name
    })
    category : UnitedCategories | Types.ObjectId;

    @Prop({
        type: [{ type: Types.ObjectId, ref: ScrapedProduct.name }]  // Массив с ссылками на документы ScrapedProduct
    })
    sources: ScrapedProduct[] | Types.ObjectId[];  // Ссылаемся на коллекцию ScrapedProduct


}