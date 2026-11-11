// 카테고리 타입 정의
export type Category = "마우스" | "키보드" | "모니터" | "주변기기"

// Product(상품) 타입 정의
export interface Product{
    id: number;
    pName: string;
    category: Category;
    price: number;
    description: string;
    image?: string;     // 상품 이미지 경로(문자열) - 선택 속성
}

// 상품 등록 폼 타입 정의
export interface ProductForm{
    pName: string;
    category: Category;
    price: number;
    description: string;
    image: string;
}

// 상품 등록시 입력받는 값
// id는 자동으로 부여되므로 제외
export type NewProduct = Omit<Product, "id">