import api from "../axios";

export function getAllUnitedProducts(){
    return api.get('products/all-united-products')
}