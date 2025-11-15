import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches} from "class-validator";

export class UpdateProfileRequest{
    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsOptional()
    email?:string

    @IsString({message:"First name should be string "})
    @Length(1,100,{message:"First name should be longer than 1 characters and shorter than 100"})
    @IsOptional()
    firstName?: string

    @IsString()
    @Length(1, 100,{message:"Last name should be longer than 1 characters and shorter than 100"})
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    address?:string

    @IsOptional()
    @IsString()
    @Length(1,15,)
    @Matches(/^\+?\d{10,15}$/, {
        message: "Phone number must start with + and contain 10–15 digits",
    })
    phoneNumber?:string
}