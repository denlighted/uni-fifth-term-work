import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema()
export class PrivateBrands extends Document{

    @Prop({required:[true,"Private brand must have a name"]})
    name:string;

    @Prop({ required: [true,"Private brand must belong to a store"]})
    store: string

    @Prop({default:null})
    reason?: string;
}

export const PrivateBrandsSchema = SchemaFactory.createForClass(PrivateBrands);