import {IsEmail, IsOptional, IsUUID} from "class-validator";

export class UpdateRoleRequest {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}