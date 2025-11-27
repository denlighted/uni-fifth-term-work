import api from "../axios";

export function bestCartProducts(){
    return api.get("best-cart/list")
}