import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseInterceptors} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {ReviewRequest} from "./dto";
import type {Request} from 'express'
import {Authorization} from "../auth/decorators";
import {UserPopulatingInterceptor} from "../common/interceptors/user-populating.interceptor";

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
    return await this.reviewsService.createReview(productSlug, req,dto);
  }

  @Authorization()
  @Patch("update-review/:id")
  async updateReview(@Req() req:Request,@Param('id') id:string ,@Body() dto:ReviewRequest){
    return await this.reviewsService.updateReview(req,id,dto)
  }

  @Authorization()
  @Delete("delete-review/:id")
  async deleteReview(@Req() req:Request,@Param('id') id:string){
    return await this.reviewsService.deleteReviewById(req,id)
  }

}
