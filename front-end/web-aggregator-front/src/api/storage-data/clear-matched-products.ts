import api from "../axios";

export function clearMatchedProducts() {
    return api.delete("/products/clear-matched-products")
}