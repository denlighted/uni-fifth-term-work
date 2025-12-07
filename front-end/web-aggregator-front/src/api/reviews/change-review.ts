import {reviewRequest} from "@project/shared/dist/review/create-review";
import api from "../axios";

export function changeReview(id:string,data:reviewRequest){
    return api.patch(`/reviews/update-review/${id}`,data)
}