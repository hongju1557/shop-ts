import api from "./api";
import type { Category, NewProduct, Product } from "../types/product";

// 서버와 연결할 파일
// 서버(DB)에서 데이터 타입 정의
interface ProductRow{
    id: number;
    p_name: string;
    category: Category;
    price: number;
    description: string;
    image: string | null
}

// DB 데이터 -> 화면 보여주기
const toProduct = (row: ProductRow) : Product => ({
    id: row.id,
    pName: row.p_name,
    category: row.category,
    price: row.price,
    description: row.description,
    image: row.image ?? undefined, // 경로 "/images/keyboard"png"
})

// 상품 목록 
export const getProducts = async () => {
    const response = await api.get<ProductRow[]>('/products');
    return response.data.map(toProduct);
}

// 상품 등록(폼 필드에 입력된값을 DB로 보냄)
export const createProduct = async (product: NewProduct) => {
    await api.post("/products", {
        pName: product.pName,
        category: product.category,
        price: product.price,
        description: product.description,
        image: product.image
    });
} 

export const deleteProduct = async (productId: number) => {
    await api.delete(`/products/${productId}`)
}

export const modifyProduct = async(product: Product) => {
    await api.put(`/products/${product.id}`, {
        pName: product.pName,
        category: product.category,
        price: product.price,
        description: product.description,
        image: product.image

    });
}
