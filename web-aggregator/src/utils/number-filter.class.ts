import {IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class NumberFilter {
    @IsOptional()
    @Type(() => Number)
    gte?: number;

    @IsOptional()
    @Type(() => Number)
    gt?: number;

    @IsOptional()
    @Type(() => Number)
    lte?: number;

    @IsOptional()
    @Type(() => Number)
    lt?: number;
}