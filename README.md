# Travel App (Frontend) - 나만의 맞춤형 여행 일정 관리 앱

## 프로젝트 개요 (Overview)

- 여행 어플리케이션인 '트리플' 앱을 벤치마킹 해서 제작한 여행 장소, 경로, 일정을 직관적으로 관리할 수 있는 웹 애플리케이션의 프론트엔드입니다.
- 개발 인원: 1인(Full-Stack)
- 개발 기간: 2025.06.18 ~ 2026.07.09

## 핵심 기능 (Key Feature)

- 장소 및 일정 탐색: 도시 및 장소 탐색, 위경도 데이터를 기반으로 한 랜드마크 조회 및 일정 시퀀스(순서) 관리 UI 제공
- 배낭(Backpack): 여행 일정에 담긴(찜) 장소를 북마크하고 한눈에 모아보는 기능
- 인증(Auth): JWT 토큰을 활용한 로그인, 회원가입, 비밀번호/계정 찾기 UI
- AI 기반 맞춤형 일정 추천: Gemini API 응답을 바탕으로 사용자의 취향에 맞는 최적의 여행 동선 커스터마이징 모달 및 추천 페이지 렌더링

## 아키텍쳐 및 상태 관리 (Architecture & State Management)

- 상태 중앙화: 전역 상태 관리 스토어(`useAuthStore`, `usePlanStore`)를 활용하여 다중 페이지 간의 상태 동기화 유지
- 모듈 분리: API 통신(`src/api`), 커스텀 훅(`src/hooks`), 재사용 가능 컴포넌트(`src/components`) 등으로 계층을 분리하여 유지보수성 증대

### 기술

- **프레임워크:** React
- **언어:** TypeScript
- **빌드 툴:** Vite
- **패키지 매니저:** pnpm
- **스타일링:** CSS Modules / PostCSS
- **Linting:** ESLint

### 실행 방법

1. `travel_app_front` 디렉토리로 이동합니다:
   ```bash
   cd travel_app_front
   ```
2. 패키지 매니저를 사용하여 의존성을 설치합니다:
   ```bash
   pnpm install
   ```
3. 로컬 개발 서버를 실행합니다:
   ```bash
   pnpm run dev
   ```
   어플리케이션은 주로 `http://localhost:5173`에서 실행됩니다.
4. 프로덕션을 위해 빌드합니다:
   ```bash
   pnpm run build
   ```
5. 빌드된 프로덕션을 미리보기 합니다:
   ```bash
   pnpm run preview
   ```
