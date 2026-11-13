# 📱 Travel App (Frontend Client)

<div align="center">

**트리플(Triple) 스타일의 감각적인 모바일 뷰포트 여행 플래너 클라이언트**

실시간 항공권 검색·결제 바텀바, Leaflet 인터랙티브 지도 & DnD 타임라인, /my 일정 일괄 삭제, 텍스트 하드코딩 0%

<p align="center">
  <img src="https://img.shields.io/badge/Framework-React%2019.1.1-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Language-TypeScript%205.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Bundler-Vite%207.1.7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Package-pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/State-TanStack%20Query%20v5-FF4154?logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Map-React%20Leaflet-199900?logo=leaflet&logoColor=white" alt="Leaflet" />
</p>

🔗 **[⚙️ 백엔드 레포지토리 바로가기 (travel_app)](https://github.com/junha2020/travel_app)**

</div>

---

## 📌 1. 프로젝트 개요 (Overview)

- **레포지토리**: `travel_app_front` (Frontend)
- **개발 인원**: 1인 개발 (김준하)
- **개발 기간**: 2025.06.18 ~ 2026.10.01
- **핵심 UI/UX 철학**:
  - **트리플(Triple) 스타일 모바일 뷰포트**: 데스크톱에서도 448px(`max-w-md`) 모바일 프레임으로 중앙 정렬되는 앱 라이크(App-like) 인터페이스.
  - **텍스트 하드코딩 0% 철학**: API에 없는 장소 설명, 리뷰, 수하물 규정 등을 가짜로 컴포넌트에 하드코딩하지 않고, TypeScript 인터페이스 및 DTO 규격화로 외부 주입 구조 완수.
  - **Fast Refresh 완벽 준수**: 컴포넌트와 상수를 독립 모듈(`src/constants/navigation.ts`)로 분리하여 Vite HMR(Hot Module Replacement) 무결점 보장.

---

## ✨ 2. 핵심 UI 기능 (Key UI Features)

### 🛫 1) 스카이스캐너 실시간 항공권 검색 & 상세 예약 UI

- **IATA 인원 & 좌석 라디오**: 성인·소아·유아 3대장 인원 모달 및 단일 선택 라디오(`cabinClass`) 인터랙션.
- **글로벌 오픈 로고 CDN (`pics.avs.io`)**: CORS 403 차단 없는 항공사 실시간 로고 출력 및 텍스트 뱃지 폴백.
- **448px 컨테이너 결제 바텀바**: 데스크톱 화면에서 100vw로 늘어지지 않고 모바일 프레임 안에 완벽 고정되는 Sticky 예약 바.

### 🗓️ 2) 인터랙티브 여행 플래너 타임라인 (`PlanDetailPage.tsx`)

- **OpenStreetMap & Leaflet 지도**: 실시간 타일 렌더링, 일차별 번호 핀 마커, 이동 경로 폴리라인(Polyline).
- **실시간 드래그 앤 드롭 (DnD)**: 마우스 및 터치로 장소의 순서 및 일차를 직관적으로 변경.
- **하버사인 거리 자동 계산**: 위경도 좌표를 연산하여 장소 간 직선 이동 거리를 알약 뱃지로 자동 렌더링.
- **Open-Meteo 실시간 7일 날씨**: 도시 좌표 기반으로 일차별 실시간 날씨 이모지 자동 바인딩.

### 📋 3) /my 일정 다중 선택 일괄 삭제 & 원클릭 관리

- **편집 모드 토글**: 다중 선택 체크박스를 통해 여러 일정을 선택한 뒤 하단 플로팅 바에서 일괄 삭제(`Promise.all`).
- **1초 컷 개별 삭제**: 기본 모드에서는 카드 우측 미니 휴지통(`Trash2`) 클릭 시 버블링을 방지(`stopPropagation`)하고 즉시 단일 삭제.

### 📱 4) 글로벌 하단 네비게이션(NavBar) 화이트리스트 격리

- **Apple HIG & Google Material 3 표준**: 최상위 3대 메인 탭(`["/", "/places", "/my"]`)에서만 노출되고, 서브/상세 화면에서는 자동으로 숨김(`return null`).
- **동적 패딩 싱크**: 메인 탭일 때만 `pb-[64px]`, 서브 화면은 `pb-0`으로 전체 화면 100% 클린 뷰포트 확보.

---

## 🛠️ 3. 기술 스택 (Tech Stack)

| 구분                | 기술                    | 상세 스펙                           |
| :------------------ | :---------------------- | :---------------------------------- |
| **Library**         | React                   | React 19.1.1                        |
| **Language**        | TypeScript              | TypeScript 5.9.3                    |
| **Bundler**         | Vite                    | Vite 7.1.7                          |
| **Package Manager** | **pnpm**                | 효율적인 의존성 관리                |
| **Styling**         | Tailwind CSS            | v4.2.0                              |
| **Server State**    | TanStack React Query    | v5.90.21                            |
| **Client State**    | Zustand                 | v5.0.11                             |
| **Map**             | Leaflet / React-Leaflet | Leaflet 1.9.4 / React-Leaflet 5.0.0 |
| **Icons**           | Lucide React            | v0.548.0                            |
| **HTTP Client**     | Axios                   | v1.13.1                             |

---

## 🚀 4. 로컬 실행 가이드 (Getting Started)

### 요구사항 (Prerequisites)

- **Node.js**: v20 이상
- **pnpm**: v9 이상 (필수: `npm install -g pnpm`)

### 실행 순서

1. 레포지토리 클론:
   ```bash
   git clone https://github.com/junha2020/travel_app_front.git
   cd travel_app_front
   ```
2. **pnpm**으로 패키지 의존성 설치:
   pnpm install

3. 로컬 개발 서버 구동:
   pnpm dev

• 브라우저에서 http://localhost:5173으로 접속합니다. 4. 프로덕션 빌드 검증:
pnpm build
