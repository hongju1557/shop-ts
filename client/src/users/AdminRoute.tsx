import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

// URL을 직접 입력해도 관리자만 하위 페이지에 접근할 수 있습니다.
const AdminRoute = () => {
    const { currentUser } = useUser();

    if (!currentUser) {
        return <Navigate to="/signin" replace />;
    }

    if (currentUser.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
