import api from "../axios";

export function deleteUsersReview(reviewId:string){
    return api.delete(`/reviews/delete-review/${reviewId}`)
}