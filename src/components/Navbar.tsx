import React from 'react';
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">TravleApp</Link>
            <ul className="nav-links">
                <li>
                    <Link to="/">홈</Link>
                </li>
                <li>
                    <Link to="/places">저장된 장소</Link>
                </li>
                <li>
                    <Link to="/my-plans">내 여행</Link>
                </li>
                <li>
                    <Link to="/login">로그인</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;