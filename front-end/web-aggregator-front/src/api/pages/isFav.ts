import api from "../axios";

export function isFav(productId:string):Promise<boolean> {

    return api.get(`/favorites/is-favorite/${productId}`)
}