import {IsNotEmpty, IsString} from "class-validator";

export class FavoriteActionRequest {
    @IsString()
    @IsNotEmpty()
    productId:string;
}