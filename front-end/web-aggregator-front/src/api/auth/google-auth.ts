import api from "../axios";

export function googleAuth(){
    return api.get('auth/google');
}