
import type {Product} from "../types/product"

// 임시 데이터 입력
export const initialProducts: Product[] = [
    { id: 1, pName: "무선 마우스", category: "마우스", price: 25000, description: "조용한 클릭음의 2.4GHz 무선 마우스" },
    { id: 2, pName: "기계식 키보드", category: "키보드", price: 89000, description: "청축 스위치, RGB 백라이트" },
    { id: 3, pName: "27인치 모니터", category: "모니터", price: 279000, description: "QHD 해상도, 165Hz 주사율" },
    { id: 4, pName: "USB-C 허브", category: "주변기기", price: 39000, description: "HDMI·USB 3.0·SD 카드 지원 7in1" },
    { id: 5, pName: "웹캠 FHD", category: "주변기기", price: 45000, description: "1080p 30fps, 자동 초점" },
]