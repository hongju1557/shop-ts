import { Link, useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";


const NO_IMAGE = "/images/no-image.png"
// 상품 상세보기 컴포넌트
const ProductDetail = () => {
    const {id} = useParams<{id: string}>();
    const {products, removeProduct} = useProduct();
    const {addToCart} = useCart();
    const { currentUser } = useUser();
    const navigate = useNavigate();

    // find() 로 해당 id와 일치하는 상품 찾기
    // product/3  - 3이 문자이므로 숫자로 형변환
    const product = products.find(p => p.id === Number(id))

    if(!product){
        return <div>상품을 찾을 수 없습니다.</div>
    }

    const handleDelete = async () => {
        if(!window.confirm("정말로 상품을 삭제할까요?")) return;
        try {
            await removeProduct(product.id)
            alert("상품이 삭제되었습니다.")
            navigate('/')
        } catch {
            alert("상품 삭제중 오류가 발생했습니다.")
        }
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
            <button 
                className="product-detail_cart"
                onClick={() => {
                    if(!currentUser){
                        alert("로그인이 필요합니다.");
                        navigate('/signin');
                        return;
                    }
                    addToCart(product.id, 1);
                    alert("상품이 장바구니에 담겼습니다.")
                }}>담기</button>
                {currentUser?.role === "admin" && <div className="product-detail_admin">
                    <button className="product-detail_delete" onClick={handleDelete}>삭제</button>
                    <Link
                    to={`/product/${product.id}/edit`}
                    className="product-detail_edit">수정</Link>
                </div>}
        </div>
    )
}

export default ProductDetail;
