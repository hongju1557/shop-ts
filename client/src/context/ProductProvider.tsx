import { useEffect, useState } from "react"
import { ProductContext } from "./ProductContext"
import type {NewProduct, Product} from "../types/product"
import { getProducts, createProduct, editProduct, removeProduct } from "../api/products"


// ProductProvider는 저장소(repository) 역할
const ProductProvider = ({children} : {children: React.ReactNode}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        getProducts()
            .then(setProducts)
            .catch(() => setError("상품 목록을 불러오지 못했습니다. 잠시 후 새로고침해주세요."))
            .finally(() => setLoading(false))
    },[])

    // 상품 추가 함수
    const addProduct = async (newProduct: NewProduct) => {
        const product = await createProduct(newProduct);
        setProducts(previous => [...previous, product]);
    }

    const updateProduct = async (id: number, newProduct: NewProduct) => {
        const product = await editProduct(id, newProduct);
        setProducts(previous => previous.map(item => item.id === id ? product : item));
    };

    const deleteProduct = async (id: number) => {
        await removeProduct(id);
        setProducts(previous => previous.filter(item => item.id !== id));
    };

    return(
        <ProductContext.Provider value={{products, loading, error, addProduct, updateProduct, deleteProduct}}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductProvider
