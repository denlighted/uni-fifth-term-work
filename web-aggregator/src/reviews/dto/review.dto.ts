import {IsNotEmpty, IsNumber, IsString, Length, Max, Min} from "class-validator";

export class ReviewRequest{

    @IsString({ message: 'Review must be a string' })
    @IsNotEmpty({message: 'Review should not be empty'})
    @Length(3, 300, { message: 'Review must be at least 3 characters and no more than 300'})
    review:string

    @IsNumber()
    @IsNotEmpty({ message: "Rating is required" })
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating cannot exceed 5" })
    rating: number;

}