import ProductCard from "./ProductCard";
import { useProduct } from "../context/ProductContext";

const ProductList = () => {
    //  useProduct() 훅으로 데이터를 사용함
    const { products } = useProduct();

    return(
        <div className="product-list">
            {products.map(product => (
                <ProductCard 
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    )
}

export default ProductList;