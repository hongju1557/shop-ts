import { createContext, useContext } from "react";
import type { CartItem } from "../types/cart";

// 장바구니 컨텍스트 타입 정의
interface CartContextType{
    cartItems: CartItem[]; // 장바구니 목록
    addToCart: (productId: number, qty: number) => void;
    updateQuantity: (productId: number, qty: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    totalQuantity: number;
    totalPrice: number;
}

// 장바구니 컨텍스트 생성
export const CartContext = createContext<CartContextType | null>(null);

// useCart() 훅 생성
export const useCart = () => {
    const context = useContext(CartContext);
    if(!context){
        throw new Error("useCart는 CartProvider 안에서만 사용 가능합니다.");
    }
    return context;
}