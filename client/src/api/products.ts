import type { Category, Product } from "../types/product";
import api from "./api";

interface ProductRow{
    id:number;
    p_name: string;
    category: Category;
    price:number;
    description:string;
    image?: string | null;
}

// DB 데이터 -> 화면

const toProduct = (row:ProductRow) : Product => ({
    id: row.id,
    pName: row.p_name,
    category: row.category,
    price: row.price,
    description: row.description,
    image: row.image ?? undefined,
})

export const getProducts = async () => {
    const response = await api.get<ProductRow[]>('/products');
    return response.data.map(toProduct);
}