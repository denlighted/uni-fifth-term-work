import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UnitedProducts} from "../../products/schemas";
import * as mongoose from "mongoose";

export type CartProductDocument = BestCart & Document;

@Schema({timestamps: true})
export class BestCart{

    @Prop({required: true })
    userId: string;

    @Prop({required: true,type: mongoose.Types.ObjectId,ref: 'UnitedProducts'})
    unitedProduct:UnitedProducts|mongoose.Types.ObjectId;

    @Prop({ type: Number, default: 1 })
    quantity: number;
}

export const BestCartSchema = SchemaFactory.createForClass(BestCart);