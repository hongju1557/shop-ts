// Context API 
import { createContext, useContext } from "react";
import type { User, NewUser, LoginForm } from "../types/user";

// 회원 컨텍스트 타입 정의
// 구현할 기능을 선언하는 타입 정의
// Promise - 지금은 결과가 없지만 나중에 결과를 주겠다는 약속(async ~ await)
interface UserContextType{
    users: User[];  //회원(목록) 조회
    currentUser: User | null; //로그인한 회원
    signup: (newUser: NewUser) => Promise<void>; // 회원가입
    login: (loginForm: LoginForm) => Promise<boolean>; //로그인 성공 여부 반환
    logout: () => void;  //로그아웃
}

// 회원 컨텍스트 생성
export const UserContext = createContext<UserContextType | null>(null);

// 사용자 훅 만들기
export const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error("useUser는 UserProvider 내부에서만 사용 가능")
    }
    return context;
}