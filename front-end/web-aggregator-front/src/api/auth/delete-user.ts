import api from "../axios";

export function deleteUserByAdmin(userId:string){
    return api.delete(`/auth/users/delete-one/${userId}`,)
}