
export type Role = "user" | "admin"

// 회원 타입 정의
export interface User{
    id: number,
    username: string,
    password?: string,
    name: string,
    email: string,
    role: Role
}

// 회원 가입시 저장하는 값
export type NewUser = Omit<User, "id"> & { password: string }

// 회원 정보 수정 폼 타입 (아이디는 API 경로로 전달)
export type UserUpdateForm = Pick<User, "name" | "email">;

// 회원 가입 폼 타입(DTO-화면으로 전달되는 데이터)  
/*export interface SignUpForm{
    username: string;
    password: string;
    passwordConfirm: string;
    name: string;
    email: string;
}*/

// 회원 가입 폼 상속
export interface SignUpForm extends Omit<User, "id" | "role">{
    password: string;
    passwordConfirm: string;  //비밀번호 확인
}

// 로그인 폼 타입 정의
export interface LoginForm{
    username: string;
    password: string;
}



