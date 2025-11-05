import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ScrapedCategory } from "./scraped-categories.schema";
import {Types,Document} from "mongoose";
import type {NextFunction} from "express";


@Schema()
export class ScrapedProduct  extends Document{

    @Prop({
        required: [true,"Product got to have a name"],
        minlength:3,
        maxlength:200
    })
    name:String

    @Prop({
        required: [true,"Product got to have a price"],
        default:0,
    })
    price:number

    // @Prop({
    //     required: [true,"Product got to have a slug"],
    //     unique:false // Slag can be repeated
    // })
    // productSlugFromSourse:string

    @Prop({required: [true,"Product got to have a source shop"]})
    store:string

    @Prop({
        trim: true,
    })
    imageLink: string;

    @Prop({required: [true,"Product got to have a category"],
        type:Types.ObjectId,
        ref:ScrapedCategory.name }) // Exactly here we have our one-to-many relation
    category: ScrapedCategory | Types.ObjectId;


    @Prop({ type: Map, of: String })
    productInfo?: Record<string, string>;

    @Prop()
    description?: string
}

export const ScrapedProductSchema = SchemaFactory.createForClass(ScrapedProduct);

ScrapedProductSchema.pre(/^find/, function (this:any,next:NextFunction) {
    this.populate({
        path:"category",
        select:"name url -_id"
    });
    next();
});