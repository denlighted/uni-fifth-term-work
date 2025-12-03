import api from "../axios";

export function isCart(productId: string) :Promise<boolean> {
    return api.get(`/best-cart/is-carted/${productId}`)
}