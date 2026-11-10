import { useState } from "react"
import { ProductContext } from "./ProductContext"
import type {NewProduct, Product} from "../types/product"
import {initialProducts} from "../datas/products"

// ProductProvider는 저장소(repository) 역할
const ProductProvider = ({children} : {children: React.ReactNode}) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    // 상품 추가 함수
    const addProduct = (newProduct: NewProduct) => {
        // 순번으로 자동으로 저장(유일해야 하므로 날짜와시간으로 사용)
        const product: Product = {...newProduct, id: Date.now()};
        setProducts([...products, product])
    }

    return(
        <ProductContext.Provider value={{products, addProduct}}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductProvider