import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PlacesListPage from './pages/PlacesListPage'
import LoginPage from './pages/LoginPage'

function App() {

    return (
        <>
            {/* 네비게이션 바는 공통 */}
            <Navbar/>

            {/* 메인 컨텐츠 영역 */}
            <main className="main-content">
                {/* URL 경로에 따라 다른 페이지 */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/places" element={<PlacesListPage />} />
                    <Route path="/login" element={<LoginPage />}/>
                    <Route path="*" element={<h1>404 - 페이지를 찾을 수 없습니다.</h1>} />
                </Routes>
            </main>
        </>
    )
}

export default App
