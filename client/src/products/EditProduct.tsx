import { useParams } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import AddProduct from './AddProduct';

export default function EditProduct() {
    const { id } = useParams();
    const { products, loading, error } = useProduct();
    if (loading) return <p>상품을 불러오는 중입니다.</p>;
    if (error) return <p role="alert">{error}</p>;
    const product = products.find(item => item.id === Number(id));
    if (!product) return <p>상품을 찾을 수 없습니다.</p>;
    return <AddProduct key={product.id} product={product} />;
}
