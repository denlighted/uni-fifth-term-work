import {IsEmail, IsNotEmpty} from "class-validator";

export class ForgotPasswordRequest {
    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsNotEmpty({message:"Email should not be empty"})
    email:string
}