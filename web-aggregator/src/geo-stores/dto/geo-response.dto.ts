import {IsNotEmpty, IsNumber} from "class-validator";

export class UsersGeoResponse{
    @IsNumber({},{message: 'GeoResponse of lat must be a number'})
    @IsNotEmpty({message:'GeoResponse of lat should not be empty'})
    lat:number

    @IsNumber({},{message: 'GeoResponse of lon must be a number'})
    @IsNotEmpty({message:'GeoResponse of lon should not be empty'})
    lon:number

}