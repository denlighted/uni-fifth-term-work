import {IsNumberString, IsOptional} from "class-validator";


export class BaseQueryDto {
    @IsOptional()
    @IsNumberString()
    page?:number;


    limit?:number;


    sort?:string;


    fields?:string;


    [key:string]:any
}