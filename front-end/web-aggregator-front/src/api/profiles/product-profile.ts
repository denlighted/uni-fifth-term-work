import api from "../axios";

export function getProductBySlug(slug:string){
    return api.get(`/products/profile/${slug}`);
}