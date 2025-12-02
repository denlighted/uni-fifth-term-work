import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {UnitedProducts} from "../../products/schemas";
import type {NextFunction} from "express";


@Schema()
export class Review {
    @Prop({
        minlength: [3, 'Review must be at least 3 chars'],
        maxlength: [300, 'Review must be less than 300 chars'],
        required: [true, "Review cannot be empty"]
    })
    review: string

    @Prop({
        required: [true, "A tour got to have a rating"],
        min: 1,
        max: 5,
    })
    rating: number

    @Prop({required: [true, "A review must have a date of creation"], default: Date.now})
    createdAt: Date

    @Prop({
        required: [true, "Review must have a product"],
        type: mongoose.Types.ObjectId,
        ref: 'UnitedProducts'
    })
    unitedProduct: UnitedProducts | mongoose.Types.ObjectId

    @Prop({
        required: [true, "Review must have a user"],

    })
    userId: string
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre(/^find/, function (this: any, next: NextFunction) {
    this.populate("unitedProduct", {__v: 0}).select({__v: 0});
    next();
});

ReviewSchema.statics.calcAverageRating = async function (productId) {
    const stats = await this.aggregate([
        { $match: { unitedProduct: productId } },
        {
            $group: {
                _id: '$unitedProduct',
                nRatings: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            }
        }
    ]);

    const ProductModel = this.db.model('UnitedProducts');

    if(stats.length > 0){
        await ProductModel.findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].nRatings,
            ratingAverage: stats[0].avgRating,
        });
    } else {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingAverage: 4.5,
        });
    }
};


ReviewSchema.post("save", async function (this: any) {
    await this.constructor.calcAverageRating(this.unitedProduct);
});

ReviewSchema.pre(/^findOneAnd/, async function(this: any, next: NextFunction) {

    this.r = await this.clone().findOne();
    next();
})

ReviewSchema.post(/^findOneAnd/, async function (this:any) {
    if (!this.r) return;
    await this.r.constructor.calcAverageRating(this.r.unitedProduct);
});

ReviewSchema.index({unitedProduct:1, userId:1}, {unique:true});