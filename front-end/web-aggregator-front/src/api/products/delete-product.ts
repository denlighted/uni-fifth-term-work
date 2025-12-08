import api from "../axios";

export function deleteProductByAdmin(productId: string) {
    return api.delete(`/products/product-delete/${productId}`)
}