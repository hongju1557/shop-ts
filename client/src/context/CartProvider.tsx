import { useState } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../types/cart";
import { useProduct } from "./ProductContext";

const CartProvider = ({children}: {children: React.ReactNode}) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    // 상품 가져오기
    const {products} = useProduct();

    // 장바구니에 상품 추가
    const addToCart = (productId: number, qty: number) => {
        setCartItems(prevItems => {
            // 이미 장바구니에 있는 상품인지 검색
            const existingItem = prevItems.find(item => 
                item.productId === productId)
            if(existingItem){
                // 이미 장바구니에 있는 상품(1 증가)
                return prevItems.map(item => 
                    item.productId === productId 
                    ? {...item, qty: item.qty + qty} : item
                )
            }else{
                // 장바구니에 처음으로 담기
                return [...prevItems, {productId, qty}]
            }
        })
    } // addToCart() 닫기

    // 장바구니에서 상품 수량 업데이트
    const updateQuantity = (productId: number, qty: number) => {
        // 장바구니에 있는 상품 중에서 선택한 상품의 수량 증가 및 감소
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.productId === productId ? {...item, qty} : item)
        );
    }

    // 장바구니의 상품 삭제(해당 id)
    const removeFromCart = (productId: number) => {
        //해당 아이디와 일치하지 않는 상품만 남긴다.
        setCartItems(prevItems => 
            prevItems.filter(item => item.productId !== productId));
    }

    // 장바구니 상품 전체 삭제
    const clearCart = () => {
        setCartItems([]);  //초기화
    }

    // 총 수량 계산
    const totalQuantity 
        = cartItems.reduce((sum, item) => sum + item.qty, 0);

    // 가격의 총합 (상품 가격 x 수량)
    const totalPrice = cartItems.reduce((sum, item) => {
        // productId로 상품 정보 찾기
        const product = products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.qty : 0);
    }, 0)

    return(
        <CartContext.Provider value={{
            cartItems, 
            addToCart,
            totalQuantity,
            totalPrice,
            updateQuantity,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;