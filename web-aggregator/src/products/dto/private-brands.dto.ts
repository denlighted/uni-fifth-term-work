import {IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

export class PrivateBrandsRequest {

    @IsString({message: 'Name of the brand should be string'})
    @IsNotEmpty({message: "Name of the brand should not be empty"})
    @Length(5, 100, {message: "Brand should be longer than 5 characters and shorter than 100"})
    name: string

    @IsString({message: 'Name of the store should be string'})
    @IsNotEmpty({message: "Name of the store should not be empty"})
    @Length(1, 100, {message: "Store title should be longer than 5 characters and shorter than 50"})
    store: string

    @IsString({message: 'Reason should be string'})
    @Length(5, 100, {message: "Reason should be longer than 5 characters and shorter than 50"})
    @IsOptional()
    reason?: string

}