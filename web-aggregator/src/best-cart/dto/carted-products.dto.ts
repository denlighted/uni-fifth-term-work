import {IsNotEmpty, IsString} from "class-validator";


export class CartedProductsRequest{
    @IsNotEmpty()
    @IsString()
    productId:string
}