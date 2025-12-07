import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseInterceptors} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {ReviewRequest} from "./dto";
import type {Request} from 'express'
import {Authorization} from "../auth/decorators";
import {UserPopulatingInterceptor} from "../common/interceptors/user-populating.interceptor";
import {User} from "@prisma/client";
import {UserInfoInterceptor} from "../common/interceptors/user-population-by-id.interceptor";

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}


  @UseInterceptors(UserPopulatingInterceptor)
  @Get("get-all")
  async getAllReviews(){
    return await this.reviewsService.getAllReviews();
  }

  @Get("get-one/:id")
  async getReviewById(@Param('id') id :string){
    return await this.reviewsService.getReviewById(id);
  }

  @Authorization()
  @Post('create-review/:productSlug')
  async createReview(@Param('productSlug') productSlug:string,@Req() req:Request , @Body() dto:ReviewRequest){
    const currentUser = req.user as User
    return await this.reviewsService.createReview(productSlug, currentUser.id,dto);
  }

  @Authorization()
  @Patch("update-review/:id")
  async updateReview(@Req() req:Request,@Param('id') id:string ,@Body() dto:ReviewRequest){
    const currentUser = req.user as User
    return await this.reviewsService.updateReview(currentUser.id,id,dto)
  }

  @Authorization()
  @Delete("delete-review/:reviewId")
  async deleteReview(@Req() req:Request,@Param('reviewId') reviewId:string){
    const currentUser = req.user as User;
    return await this.reviewsService.deleteReviewById(currentUser.id, currentUser.role,reviewId)
  }

  @Authorization()
  @Get("user-reviews")
  //@UseInterceptors(UserPopulatingInterceptor)
  async getUserReview(@Req() req:Request){
    const currentUser = req.user as User
    return await this.reviewsService.getUsersReviews(currentUser.id);
  }

  // Always last due to slug!!!
  @UseInterceptors(UserPopulatingInterceptor)
  @Get(":slug")
  async getReviewsForProd(@Param('slug') slug: string){
    return await this.reviewsService.getReviewForProductBySlug(slug)
  }

}
