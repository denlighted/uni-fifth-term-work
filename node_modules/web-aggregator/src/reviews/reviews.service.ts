import {ForbiddenException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import type{Request} from "express";
import {InjectModel} from "@nestjs/mongoose";
import {UnitedProducts} from "../products/schemas";
import {Model} from "mongoose";
import {RoleEnum, User} from "@prisma/client";
import {Review} from "./schemas/reviews.schema";
import {RestProductService} from "../products/services/rest-products.service";
import {ReviewRequest} from "./dto";



@Injectable()
export class ReviewsService {
     constructor(private readonly prismaService: PrismaService,
                 @InjectModel(Review.name) private reviews:Model<Review>,
                 private readonly restProductService: RestProductService
                 ) {
     }

     async getAllReviews(){
         return await this.reviews.find().populate("unitedProduct", {__v:0});
     }

     async getReviewById(id:string){
         return await this.reviews.findById(id);
     }

     async createReview(productSlug:string,userId:string,dto:ReviewRequest){
         const{review,rating} = dto;


         const product = await this.restProductService.getUnitedProductBySlug(productSlug);
         if (!product) {
             throw new NotFoundException("Product does not exist");
         }

         const existingReview = await this.reviews.findOne({ unitedProduct: product._id, userId: userId });

         if(existingReview){
             throw new ForbiddenException("You have already reviewed this product");
         }


         const newReview = await this.reviews.create({
             review,
             rating,
             unitedProduct: product._id,
             userId:userId
         });

         return newReview;
     }

     async deleteReviewById(userId:string, role:RoleEnum,id:string){

         const review = await this.reviews.findById(id);

         if (!review) {
             throw new NotFoundException("Review not found");
         }

         if(userId !== review.userId && role !== RoleEnum.ADMIN){
             throw new ForbiddenException("You cannot delete this review. It does not belong to you!");
         }

         await this.reviews.deleteOne({_id:id})

         return {success:"true", message:"The review has been successfully deleted"}
     }

     async updateReview(userId:string,id: string, dto:ReviewRequest){

         const {review, rating} = dto;
         const reviewFromDb = await this.reviews.findById(id);


         if (!reviewFromDb) {
             throw new NotFoundException("Review not found");
         }

         if(userId !== reviewFromDb.userId){
             throw new ForbiddenException("You cannot edit this review. It does not belong to you!");
         }

         reviewFromDb.review = review;
         reviewFromDb.rating = rating;

         await reviewFromDb.save();

         return reviewFromDb;

     }

     async getReviewForProductBySlug(slug:string){
         const product = await this.restProductService.getUnitedProductBySlug(slug);
         if (!product) {
             return []; // или throw new NotFoundException('Product not found')
         }
         console.log(product._id);

         const reviews = await this.reviews.find({unitedProduct:product._id});
         return reviews;
     }



}
