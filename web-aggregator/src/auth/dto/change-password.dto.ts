import {IsNotEmpty, IsString, Length} from "class-validator";
import {PasswordMatches} from "../decorators";

export class ChangePasswordRequest{

    @IsString({message:"New password should be string "})
    @IsNotEmpty({message:"New password should not be empty"})
    @Length(5,100,{message:"New password should be longer than 5 characters and shorter than 100"})
    password:string

    @IsString({message:"New password confirm should be string "})
    @IsNotEmpty({message:"New password confirm should not be empty"})
    @Length(5,100,{message:"New password confirm should be longer than 5 characters and shorter than 100"})
    @PasswordMatches({ message: 'New password confirm do not match' })
    passwordConfirm:string

    @IsString({message:"Old password should be string "})
    @IsNotEmpty({message:"Old password should not be empty"})
    @Length(5,100,{message:"Old password should be longer than 5 characters and shorter than 100"})
    oldPassword:string
}