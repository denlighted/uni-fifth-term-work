import api from "../axios";

export function getUsersReviews(){
    return api.get("/reviews/user-reviews")
}