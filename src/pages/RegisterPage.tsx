import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import type { UserSignUpRequestDTO } from "../types/userTypes";
import { register } from '../api/authApi';
import styles from './css/RegisterPage.module.css';
import { Eye, EyeOff, UserPlus } from "lucide-react";

const RegisterPage = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [nickName, setNickName] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('');
        setIsLoading(true);

        try {
            const credentials: UserSignUpRequestDTO = { userName, password, email, nickName };
            const userData = await register(credentials);
            console.log("회원가입 성공!", userData);
            alert("회원가입 성공! 로그인 페이지로 이동합니다.");
            navigate('/login')
        } catch (err) {
            setError((err as Error).message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <UserPlus size={48} color="#6366F1" />
                <h1 className={styles.title}>Create your account</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Username 입력 */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>Username (아이디)</label>
                        <input
                            id="usename"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="로그인 시 사용할 아이디"
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* Email 입력*/}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jsdoe@example.com"
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* Nickname 입력*/}
                    <div className={styles.inputGroup}>
                        <label htmlFor="nickname" className={styles.label}>Nickname</label>
                        <input
                            id="nickname"
                            type="text"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            placeholder="앱에서 사용할 닉네임"
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* Password 입력 */}
                    <div className={styles.inputGroup}>
                        <div className={styles.passwordLabelContainer}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                        </div>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                id="password"
                                type={isPasswordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className={styles.eyeIcon}
                            >
                                {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password 입력 */}
                    <div className={styles.inputGroup}>
                        <div className={styles.passwordLabelContainer}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                        </div>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                id="confirmPassword"
                                type={isPasswordVisible ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.signInButton} disabled={isLoading}>
                        {isLoading ? 'Signing up...' : 'Sign up'}
                    </button>
                </form>
                <p className={styles.signUpText}>
                    Already have an account? <Link to="/login" className={styles.signUpLink}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;