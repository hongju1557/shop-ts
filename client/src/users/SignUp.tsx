import { useState } from "react";
import type { SignUpForm } from "../types/user";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

// 폼 초기화 값
const initialForm: SignUpForm = {
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: ""
}

// 유효성 검사 정규식
const USERNAME_REGEX = /^(?=.*[a-z])(?=.*\d)[a-z0-9]{4,12}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SignUp = () => {
    const [form, setForm] = useState<SignUpForm>(initialForm);
    const [error, setError] = useState<string | null>(null);
    const { users, signup } = useUser();  //Context API의 사용자 훅 사용

    // 폼에 입력된 데이터 가져오기
    const { username, password, passwordConfirm, name, email } = form;
    const navigate = useNavigate();

    // 입력값 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value})
    }

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();  //기본 동작 막기

        // 유효성 검사
        if(!USERNAME_REGEX.test(username)){
            setError("아이디를 영문 소문자와 숫자 포함 4~12자로 입력해주세요");
            return;
        }
        // some() - 배열 요소 중 하나라도 조건을 만족하는지 검사하는 메서드
        if(users.some(user => user.username === username )){
            setError("이미 사용 중인 아이디입니다.");
            return;
        }
        if(password.length < 8){
            setError("비밀번호는 8자 이상 입력해주세요");
            return;
        }
        if(password !== passwordConfirm){
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        if(!name.trim()){
            setError("이름을 입력하세요");
            return;
        }
        if(!EMAIL_REGEX.test(email.trim())){
            setError("이메일 형식이 올바르지 않습니다.");
            return;
        }

        // 회원 가입 함수 호출
        try{
            await signup({
                username,
                password,
                name: name.trim(),
                email: email.trim(),
                role: "user"
            });
            alert("회원가입이 완료되었습니다. 로그인 해주세요");
            navigate('/signin'); //로그인 페이지로 이동
        }catch{
            setError("회원 가입 중 오류가 발생했습니다.");
        }
    }

    return(
        <div className="sign-up">
            <h2>회원 가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">아이디</label>
                    <input 
                        type="text" 
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleInputChange}
                        placeholder="영문 소문자와 숫자 포함, 4~12자로 입력"
                    />
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        placeholder="비밀번호를 입력해주세요"
                    />
                </div>
                <div>
                    <label htmlFor="passwordConfirm">비밀번호 확인</label>
                    <input 
                        type="password" 
                        id="passwordConfirm"
                        name="passwordConfirm"
                        value={passwordConfirm}
                        onChange={handleInputChange}
                        placeholder="비밀번호를 한 번 더 입력해주세요"
                    />
                </div>
                <div>
                    <label htmlFor="name">이름</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleInputChange}
                        placeholder="이름을 입력해주세요"
                    />
                </div>
                <div>
                    <label htmlFor="email">이메일</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        placeholder="example@test.com"
                    />
                </div>
                {error && 
                    <p className="sign-up_error">{error}</p>}
                <button type="submit">등록</button>

                <p className="signup-link">
                    이미 계정이 있으신가요? <Link to='/signin'>로그인</Link>
                </p>
            </form>
        </div>
    )
}

export default SignUp;