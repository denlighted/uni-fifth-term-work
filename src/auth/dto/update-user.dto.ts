import {IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches} from "class-validator";

export class UpdateProfileRequest{
    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsNotEmpty({message:"Email should not be empty"})
    @IsOptional()
    email?:string

    @IsString({message:"First name should be string "})
    @IsNotEmpty({message:"First name should not be empty"})
    @Length(1,100,{message:"First name should be longer than 1 characters and shorter than 100"})
    @IsOptional()
    firstName?: string

    @IsString({message:"Last name should be string "})
    @IsNotEmpty({message:"Last name should not be empty"})
    @Length(1,100,{message:"Last name should be longer than 1 characters and shorter than 100"})
    @IsOptional()
    lastName?:string

    @IsOptional()
    @IsString()
    @Length(1,15,)
    @Matches(/^\+?\d{10,15}$/, {
        message: "Phone number must start with + and contain 10–15 digits",
    })
    phoneNumber?:string
}