import { Link } from "react-router-dom";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useUser } from "../context/UserContext";
import type { User, UserUpdateForm } from "../types/user";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MyPageForm = ({ user }: { user: User }) => {
    const [form, setForm] = useState<UserUpdateForm>({
        name: user.name,
        email: user.email
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateUser } = useUser();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(form => ({ ...form, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setError(null);
        setSuccess(false);

        const updatedForm = { name: form.name.trim(), email: form.email.trim() };
        if (!updatedForm.name) {
            setError("이름을 입력하세요.");
            return;
        }
        if (!EMAIL_REGEX.test(updatedForm.email)) {
            setError("이메일 형식이 올바르지 않습니다.");
            return;
        }

        setIsSubmitting(true);
        try {
            await updateUser(updatedForm);
            setForm(updatedForm);
            setSuccess(true);
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 409) {
                setError("이미 사용 중인 이메일입니다.");
            } else if (isAxiosError(err) && err.response?.status === 404) {
                setError("회원을 찾을 수 없습니다. 다시 로그인해주세요.");
            } else {
                setError("회원 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <div className="sign-up">
            <h2>회원 정보 변경</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">아이디</label>
                    <input type="text" id="username" value={user.username} disabled />
                </div>
                <div>
                    <label htmlFor="name">이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="이름을 입력해주세요"
                        maxLength={50}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        placeholder="example@test.com"
                        maxLength={100}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                {error && <p className="sign-up_error" role="alert">{error}</p>}
                {success && <p role="status">회원 정보가 수정되었습니다.</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "수정 중..." : "수정"}
                </button>
            </form>
        </div>
    )
}

const MyPage = () => {
    const {currentUser} = useUser();
    if(!currentUser){
        return (
        <div className="sign-up">
            <p>로그인한 회원만 이용할 수 있습니다.</p>
            <Link to='/signin'>로그인</Link>
        </div>
        );
    }
    return<MyPageForm key={currentUser.id} user={currentUser}/>
}

export default MyPage
