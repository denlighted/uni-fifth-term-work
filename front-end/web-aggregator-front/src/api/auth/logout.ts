import api from "../axios";

export function logout(){
    return api.post('/auth/logout')
}