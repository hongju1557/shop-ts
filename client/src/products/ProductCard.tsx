
import { Link, useNavigate } from "react-router-dom";
import type {Product} from "../types/product"
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

const NO_IMAGE = "/images/no-image.png";  //이미지가 없는 경우 저장값

const ProductCard = ({product}: {product: Product}) => {
    const { addToCart } = useCart();
    const { currentUser } = useUser();  //로그인한 회원
    const navigate = useNavigate();

    return(
        <div className="product-card"> 
            <Link to={`/product/${product.id}`}>
                {/* ?? - null 병합 연산자. 왼쪽값이 null 이거나 undefined 일 때 */}
                <img 
                    className="product-card_img"
                    src={product.image ?? NO_IMAGE}
                    alt={product.pName} 
                />
            </Link>
            <span>{product.category}</span>
            <h3>
              <Link to={`/product/${product.id}`}>{product.pName}</Link>
            </h3>
            <p>{product.price.toLocaleString()}원</p>
            <button onClick={() => {
                if(!currentUser){
                    alert("로그인이 필요합니다.");
                    navigate('/signin');
                    return;
                }
                addToCart(product.id, 1);
                alert("상품이 장바구니에 담겼습니다.")
            }}>담기</button>
        </div>
    )
}

export default ProductCard;