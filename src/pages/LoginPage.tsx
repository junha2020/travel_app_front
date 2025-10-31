import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, AlertTriangle } from 'lucide-react'; // lucide-react에서 아이콘 가져오기
import styles from './css/LoginPage.module.css'
import { login } from '../api/authApi';
import type { UserLoginRequestDTO } from '../types/userTypes';

// 로고 컴포넌트
const Logo = () => (
    <img src="/public/favicon.png" alt="Logo" className={styles.logo}/>
);

const LoginPage = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [view, setView] = useState('signIn'); // 'signIn' or 'forgotPassword'

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const credentials: UserLoginRequestDTO = { userName, password };
            const userData = await login(credentials);
            console.log("로그인 성공!", userData);
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setView('forgotPassword');
    };

    const handleBackToSignInClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setView('signIn');
        setError('');
    };

    return (
        <div className={styles.container}>
            {view === 'signIn' ? (
                <div className={styles.loginBox}>
                    <Logo/>
                    <h1 className={styles.title}>Sign in to your account</h1>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className="label">Email</label>
                            <input
                                id="username"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="아이디를 입력하세요"
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.passwordLabelContainer}>
                                <label htmlFor="password" className={styles.label}>Password</label>
                                <a href="#" onClick={handleForgotPasswordClick} className={styles.forgotPassword}>forgot
                                    password?</a>
                            </div>
                            <div className={styles.passwordInputWrapper}>
                                <input
                                    id="password"
                                    type={isPasswordVisible ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호를 입력하세요"
                                    className={styles.input}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className={styles.eyeIcon}
                                >
                                    {isPasswordVisible ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </button>
                            </div>
                        </div>
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className={styles.signInButton} disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                    <p className={styles.signUpText}>
                        No account yet? <Link to="/register" className={styles.signUpLink}>Sign up</Link>
                    </p>
                </div>
            ) : (
                <div className={`${styles.loginBox} ${styles.forgotPasswordBox}`}>
                    <AlertTriangle size={48} color="#F56565"/>
                    <h2 className={styles.forgotPasswordTitle}>Not available</h2>
                    <p className={styles.forgotPasswordText}>Password reset is not configured on this instance</p>
                    <div className={styles.buttonGroup}>
                        <button onClick={handleBackToSignInClick} className={styles.signInButton}>Sign In</button>
                        <button className={`${styles.signInButton} ${styles.secondaryButton}`}>Setup instructions</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;