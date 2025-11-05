import {Prop} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {ScrapedCategory, ScrapedProduct} from "../../scraper/schemas";
import {Document} from "mongoose";

export class UnitedCategories extends Document {

    @Prop({required: [true, 'Name is required for category']})
    name:string

    @Prop({
        type: [{ type: Types.ObjectId, ref: ScrapedCategory.name }]
    })
    sources: ScrapedCategory[] | Types.ObjectId[];

}