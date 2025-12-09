import api from "../axios";

export function getProductsBrands() {
    return api.get("/products/unique-brands")
}