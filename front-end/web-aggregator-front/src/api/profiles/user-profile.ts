import api from "../axios";

export function getUserProfile(){
    return api.get("/auth/@me")
}