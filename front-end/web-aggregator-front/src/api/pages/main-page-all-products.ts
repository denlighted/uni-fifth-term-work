import api from "../axios";

export function getAllUnitedProducts(params:any){
    return api.get('products/all-united-products',{params})
}