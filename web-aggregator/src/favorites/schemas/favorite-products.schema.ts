import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UnitedProducts} from "../../products/schemas";
import * as mongoose from "mongoose";


@Schema({ timestamps: true })
export class FavoriteProducts {

    @Prop({
        required: [true, "Review must have a product"],
        type: mongoose.Types.ObjectId,
        ref: 'UnitedProducts'
    })
    unitedProduct: UnitedProducts | mongoose.Types.ObjectId

    @Prop()
    userId:string


}

export const FavoriteProductSchema = SchemaFactory.createForClass(FavoriteProducts);