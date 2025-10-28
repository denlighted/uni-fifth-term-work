import {IsNotEmpty, IsString, Length} from "class-validator";
import {PasswordMatches} from "../decorators/password-matches.decorator";

export class ResetPasswordRequest{

    @IsString({message:"Password should be string "})
    @IsNotEmpty({message:"Password should not be empty"})
    @Length(5,100,{message:"Password should be longer than 5 characters and shorter than 100"})
    password:string

    @IsString({message:"Password should be string "})
    @IsNotEmpty({message:"Password should not be empty"})
    @Length(5,100,{message:"Password should be longer than 5 characters and shorter than 100"})
    @PasswordMatches({ message: 'Passwords do not match' })
    passwordConfirm:string
}