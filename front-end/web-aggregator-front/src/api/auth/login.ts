import type { LoginRequest } from "@project/shared";
import api from "../axios";


export function loginUser(data:LoginRequest){
    return api.post('auth/login',data)
}