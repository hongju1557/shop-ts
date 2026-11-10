import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { errorMessage } from "../api/errors";
import { useProduct } from "../context/ProductContext";
import { useCart } from "../context/CartContext";

const NO_IMAGE = "/images/no-image.png"
// 상품 상세보기 컴포넌트
const ProductDetail = () => {
    const {id} = useParams<{id: string}>();
    const {products, loading, error, deleteProduct} = useProduct();
    const {addToCart, removeFromCart} = useCart();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // find() 로 해당 id와 일치하는 상품 찾기
    // product/3  - 3이 문자이므로 숫자로 형변환
    const product = products.find(p => p.id === Number(id))

    if (loading) return <p>상품을 불러오는 중입니다.</p>;
    if (error) return <p role="alert">{error}</p>;
    if(!product){
        return <div>상품을 찾을 수 없습니다.</div>
    }

    return(
        <div className="product-detail">
            {/* -?.은 옵셔널 체이닝- 상품을 못찾아 undefined일때 오류 대신
              undefined를 돌려준다 */}
            <Link to='/' className="product-detail_back" >← 상품 목록</Link>
            <Link to={`/product/${product.id}`}>
                <img 
                    className="product-detail_img"
                    src={product.image ?? NO_IMAGE}
                    alt={product.pName} 
                />
            </Link>
            <span className="product-detail_category">{product?.category}</span>
            <h2>{product?.pName}</h2>
            <p className="product-detail_price">{product?.price.toLocaleString()}원</p>
            <p className="product-detail_desc">{product?.description}</p>
            <div className="product-add_buttons">
                <Link to={`/product/${product.id}/edit`}>상품 수정</Link>
                <button type="button" disabled={deleting} onClick={async () => {
                    if (!window.confirm(`“${product.pName}” 상품을 삭제하시겠습니까?`)) return;
                    setDeleting(true);
                    setDeleteError(null);
                    try {
                        await deleteProduct(product.id);
                        removeFromCart(product.id);
                        navigate('/');
                    } catch (err) {
                        setDeleteError(errorMessage(err, '상품 삭제에 실패했습니다. 다시 시도해주세요.'));
                    } finally {
                        setDeleting(false);
                    }
                }}>{deleting ? '삭제 중…' : '상품 삭제'}</button>
            </div>
            {deleteError && <p role="alert">{deleteError}</p>}
            <button 
                className="product-detail_cart"
                onClick={() => {
                    addToCart(product.id, 1);
                    alert("상품이 장바구니에 담겼습니다.")
                }}>담기</button>
        </div>
    )
}

export default ProductDetail;
