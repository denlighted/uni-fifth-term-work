import {IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class ProductFilterDto {

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