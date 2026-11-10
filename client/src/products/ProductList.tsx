import ProductCard from "./ProductCard";
import { useProduct } from "../context/ProductContext";

const ProductList = () => {
    //  useProduct() 훅으로 데이터를 사용함
    const { products, loading, error } = useProduct();
    if (loading) return <p>상품을 불러오는 중입니다.</p>;
    if (error) return <p role="alert">{error}</p>;
    if (!products.length) return <p>등록된 상품이 없습니다.</p>;

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
