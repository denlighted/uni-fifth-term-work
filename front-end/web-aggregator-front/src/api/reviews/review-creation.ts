import {reviewRequest} from "@project/shared/dist/review/create-review";
import api from "../axios";

export function reviewCreation(data:reviewRequest,slug:string){
    return api.post(`/reviews/create-review/${slug}`,data)
}