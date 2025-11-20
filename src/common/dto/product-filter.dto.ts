import {IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {BaseQueryDto} from "./query.dto";

export class ProductFilterDto extends BaseQueryDto {

    @IsOptional()
    @IsString()
    brand?:string;

    @IsOptional()
    @Type(() => Number)
    ratingAverage?: {
        gt?: number;
        gte?: number;
        lt?: number;
        lte?: number;
    };
}