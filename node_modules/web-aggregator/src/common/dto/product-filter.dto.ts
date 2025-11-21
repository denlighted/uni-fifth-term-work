import {IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {BaseQueryDto} from "./query.dto";
import {NumberFilter} from "../../utils/number-filter.class";

export class ProductFilterDto extends BaseQueryDto {

    @IsOptional()
    @IsString()
    brand?:string;

    @IsOptional()
    @ValidateNested()
    @Type(() => NumberFilter)
    ratingAverage?: NumberFilter
}