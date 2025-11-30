import api from "../axios";

export function getCheapestShop(){
    return api.get("/best-cart/cheapest-shop")
}