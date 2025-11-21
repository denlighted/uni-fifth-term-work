import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema()
export class ScrapedCategory  extends Document {

    @Prop({required: [true, 'Name is required for category']})
    name:string

    @Prop({required: [true, 'Url is required for category']})
    url:string;

    @Prop({required: [true, 'Store is required for category']})
    store:string
}

export const ScrapedCategorySchema  = SchemaFactory.createForClass(ScrapedCategory );