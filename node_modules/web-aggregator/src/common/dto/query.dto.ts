import {IsInt, IsNumberString, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";


export class BaseQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?:number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    limit?:number;

    @IsOptional()
    @IsString()
    sort?:string;

    @IsOptional()
    @IsString()
    fields?:string;

    [key:string]:any
}