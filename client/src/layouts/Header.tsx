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

    // 관리자가 아니면 상품 등록 화면 이동을 막고 안내합니다.
    const handleAddClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isAdmin) {
            e.preventDefault();
            alert("상품 등록은 관리자만 가능합니다.");
        }
    }

    const handleLogout = async () => {
        try {
            await logout();
            clearCart();
            navigate('/');
        } catch {
            alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
        }
    }

    return(
        <header className='header'>
            <h1>
                <Link to='/'>SPACE SHOP</Link>
            </h1>
            <nav>
                <Link to='/'>상품 목록</Link>
                <Link to='/product/new' onClick={handleAddClick}>상품 등록</Link>
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
                <Link to='/mypage'>회원 정보 변경</Link>
            </nav>
        </header>
    )
}

export default Header;
