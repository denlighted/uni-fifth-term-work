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
                 @InjectModel(UnitedProducts.name) private unitedProducts:Model<UnitedProducts>,
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

     async createReview(productSlug:string,req:Request,dto:ReviewRequest){
         const{review,rating} = dto;

         const currentUser = req.user as User;

         const product = await this.restProductService.getUnitedProductBySlug(productSlug);
         if (!product) {
             throw new NotFoundException("Product does not exist");
         }

         const newReview = await this.reviews.create({
             review,
             rating,
             unitedProduct: product._id,
             userId:currentUser.id
         });

         return newReview;
     }

     async deleteReviewById(req:Request,id:string){

         const currentUser = req.user as User;

         const review = await this.reviews.findById(id);

         if (!currentUser) {
             throw new UnauthorizedException("You are not authorized");
         }

         if (!review) {
             throw new NotFoundException("Review not found");
         }

         if(currentUser.id !== review.userId && currentUser.role !== RoleEnum.ADMIN){
             throw new ForbiddenException("You cannot delete this review. It does not belong to you!");
         }

         await this.reviews.deleteOne({_id:id})

         return {success:"true", message:"The review has been successfully deleted"}
     }

     async updateReview(req:Request,id: string, dto:ReviewRequest){
         const currentUser = req.user as User;
         const {review, rating} = dto;
         const reviewFromDb = await this.reviews.findById(id);

         if (!currentUser) {
             throw new UnauthorizedException("You are not authorized");
         }

         if (!reviewFromDb) {
             throw new NotFoundException("Review not found");
         }

         if(currentUser.id !== reviewFromDb.userId){
             throw new ForbiddenException("You cannot edit this review. It does not belong to you!");
         }

         reviewFromDb.review = review;
         reviewFromDb.rating = rating;

         await reviewFromDb.save();

         return reviewFromDb;

     }

}
