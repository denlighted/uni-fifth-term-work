import api from "../axios";

export function combineProductsApi(){
    return api.post("/products/get-same-products")
}