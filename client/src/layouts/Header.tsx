import {Link, useNavigate} from 'react-router-dom'
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Header = () => {
    // totalQuantity() 가져오기
    // 장바구니() -> 표시하기
    const {totalQuantity, clearCart} = useCart();
    const {currentUser, logout} = useUser();
    const navigate = useNavigate();

    // 관리자인지 확인(isAdmin = true)
    const isAdmin = currentUser?.role === "admin";

    const handleLogout = () => {
        clearCart();
        logout();
        navigate('/');
    }

    return(
        <header className='header'>
            <h1>
                <Link to='/'>SPACE SHOP</Link>
            </h1>
            <nav>
                <Link to='/'>상품 목록</Link>
                {isAdmin && <Link to='/product/new'>상품 등록</Link>}
                <Link to='/cart'>장바구니({totalQuantity})</Link>
                {isAdmin && <Link to='/admin'>관리자</Link>}
                {currentUser ? (
                    <>
                        <span>{currentUser.name}님</span>
                        <button onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                     <Link to='/signin'>로그인</Link>
                )}
            </nav>
        </header>
    )
}

export default Header;
