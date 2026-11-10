import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProduct } from "../context/ProductContext";

const Cart = () => {
    const { 
        cartItems, 
        totalQuantity, 
        totalPrice,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();   // 장바구니 상품 사용하기
    const { products } = useProduct();  // 상품 사용하기

    // 장바구니 전체 비우기(컨펌받기)
    const handleClearCart = () => {
        if(window.confirm("정말로 장바구니를 비우시겠습니까?")){
            clearCart();
        }
    }

    return(
        <section className="cart">
            <h2>장바구니</h2>
            {cartItems.length === 0 ? (
                <p className="cart_empty">장바구니가 비어 있습니다.</p>
            ) : (
                <>
                    <ul className="cart_list">
                        {cartItems.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            return (
                                
                                <li key={item.productId} className="cart_item">
                                    {/* 상품 정보 */}
                                    <div className="cart_info">
                                        <span className="cart_category">{product?.category}</span>
                                        <span>
                                            <Link to={`/product/${product?.id}`}>{product?.pName}</Link>
                                        </span>
                                    </div>
                                    {/* 상품 수량 */}
                                    <div className="cart_quantity">
                                        <button
                                            onClick={() => 
                                                updateQuantity(item.productId, item.qty - 1)
                                            }
                                            disabled={item.qty <= 1}
                                        >-</button>
                                        <span>{item.qty}</span>
                                        <button
                                            onClick={() => 
                                                updateQuantity(item.productId, item.qty + 1)
                                            }
                                        >+</button>
                                    </div>
                                    {/* 상품 가격 계산 */}
                                    <strong className="cart_subtotal">
                                        {product ? (product.price * item.qty).toLocaleString() : 0}원
                                    </strong>
                                    <button
                                        className="cart_remove"
                                        onClick={() => {removeFromCart(item.productId)}}
                                    >삭제</button>
                                </li>
                            )
                        } )}
                    </ul>
                    {/* 통계 요약 */}
                    <div className="cart_summary">
                        <span>총 {totalQuantity}개</span>
                        <strong>{totalPrice.toLocaleString()}원</strong>
                    </div>
                    {/* 전체 비우기 및 계속 링크 */}
                    <div className="cart_buttons">
                        <button 
                            className="cart_clear"
                            onClick={handleClearCart}
                        >전체 비우기</button>
                        <Link to='/' className="cart_link">쇼핑 계속하기</Link>
                    </div>    
                    <button className="cart_order">주문하기</button>
                </>
            )}
        </section>
    )
}

export default Cart;