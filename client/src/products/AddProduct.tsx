import { errorMessage } from "../api/errors";
import { useState } from "react";
import type { ProductForm, Product } from "../types/product";
import { useProduct } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

// 등록 폼 초기화
const initialForm: ProductForm = {
    pName: "",
    category: "마우스",
    price: 0,
    description: ""
}

const AddProduct = ({ product }: { product?: Product }) => {
    const [form, setForm] = useState<ProductForm>(product ?? initialForm);
    const { addProduct, updateProduct } = useProduct();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // 폼에 입력된 데이터 가져오기
    const { pName, category, price, description } = form;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value})  //입력 데이터 저장
    }

    //  폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;
        setError(null);

        // 유효성 검사
        if(!pName.trim()){
            setError("상품명을 입력해주세요")
            return;
        }
        if(!Number.isSafeInteger(Number(price)) || Number(price) <= 0 || Number(price) > 2147483647){
            setError("가격을 올바르게 입력해주세요")
            return;
        }
        if(!description.trim()){
            setError("설명을 입력해주세요")
            return;
        }

        // 상품 추가 함수 호출
        const values = {
            pName: pName.trim(), category, price: Number(price),
            description: description.trim(), image: product?.image
        };
        setSubmitting(true);
        try {
            if (product) await updateProduct(product.id, values);
            else await addProduct(values);
            alert(product ? "상품이 수정되었습니다." : "상품이 등록되었습니다.");
            navigate(product ? `/product/${product.id}` : '/');
        } catch (err) {
            setError(errorMessage(err, '상품 저장에 실패했습니다. 다시 시도해주세요.'));
        } finally {
            setSubmitting(false);
        }
    }

    // 취소 버튼 - 폼 초기화
    const handleCancel = () => {
        setForm(product ?? initialForm);
        setError(null);
    }

    return(
        <div className="product-add">
            <h2>{product ? "상품 수정" : "상품 등록"}</h2>
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
                {error && 
                    <p className="product-add_error">{error}</p>}
                <div className="product-add_buttons">
                    <button type="submit" disabled={submitting}>{submitting ? "저장 중…" : product ? "수정" : "등록"}</button>
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