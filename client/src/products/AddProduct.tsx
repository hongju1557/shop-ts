import { useState } from "react";
import type { ProductForm } from "../types/product";
import { useProduct } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

// 등록 폼 초기화
const initialForm: ProductForm = {
    pName: "",
    category: "마우스",
    price: 0,
    description: "",
    image: ""
}

const AddProduct = () => {
    const [form, setForm] = useState<ProductForm>(initialForm);
    const { addProduct } = useProduct();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // 폼에 입력된 데이터 가져오기
    const { pName, category, price, description, image } = form;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value})  //입력 데이터 저장
    }

    //  폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 유효성 검사
        if(!pName.trim()){
            setError("상품명을 입력해주세요")
            return;
        }
        if(!price || price <= 0){
            setError("가격을 올바르게 입력해주세요")
            return;
        }
        if(!description.trim()){
            setError("설명을 입력해주세요")
            return;
        }

        // 상품 추가 함수 호출
        try{
            await addProduct({
                pName,
                category,
                price: Number(price),  //화면에 입력한 가격은 문자형이므로 숫자형변환
                description,
                image: image || undefined
            });
            alert("상품이 등록되었습니다.");
            navigate('/');  //상품 목록으로 이동
        }catch{
            setError("상품 등록중 오류가 발생했습니다.");
        }
    }

    // 취소 버튼 - 폼 초기화
    const handleCancel = () => {
        setForm(initialForm);
        setError(null);
    }

    return(
        <div className="product-add">
            <h2>상품 등록</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="pName">상품명</label>
                    <input 
                        type="text" 
                        id="pName"
                        name="pName"
                        value={pName}
                        onChange={handleChange}
                        placeholder="상품명을 입력해주세요"
                    />
                </div>
                <div>
                    <label htmlFor="category">카테고리</label>
                    <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={handleChange}
                    >
                        <option value="마우스">마우스</option>
                        <option value="키보드">키보드</option>
                        <option value="모니터">모니터</option>
                        <option value="주변기기">주변기기</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="price">가격</label>
                    <input 
                        type="number" 
                        id="price"
                        name="price"
                        value={price}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="description">설명</label>
                    <textarea 
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleChange}
                        placeholder="상품 설명을 입력해주세요"
                        rows={4}
                    />
                </div>
                <div>
                    <label htmlFor="image">이미지:</label>
                    <select
                        id="image"
                        name="image"
                        value={image}
                        onChange={handleChange}
                    >
                        <option value="">선택 안 함</option>
                        <option value="/images/mouse.png">마우스</option>
                        <option value="/images/keyboard.png">키보드</option>
                        <option value="/images/monitor.png">모니터</option>
                        <option value="/images/usb-hub.png">USB-C 허브</option>
                        <option value="/images/webcam.png">웹캠</option>
                    </select>
                    </div>
                {error && 
                    <p className="product-add_error">{error}</p>}
                <div className="product-add_buttons">
                    <button type="submit">등록</button>
                    <button 
                        type="button"
                        onClick={handleCancel}
                    >취소</button>
                </div>
            </form>
        </div>
    )
}

export default AddProduct;