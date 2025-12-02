import api from "../axios";

export function getProfileProductReviews(slug:string){
    return api.get(`reviews/${slug}`)
}