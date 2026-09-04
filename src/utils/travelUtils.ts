// 일본 8대 지원 도시 상수
export const SUPPORTED_JAPAN_CITIES = [
  "도쿄",
  "오사카",
  "후쿠오카",
  "나고야",
  "삿포로",
  "오키나와",
  "다카마쓰",
  "마쓰야마",
] as const;

export type SupportedJapanCity = (typeof SUPPORTED_JAPAN_CITIES)[number];

// 영문 URL Slug ↔ 한글 도시명 양방향 매핑
export const CITY_SLUG_MAP: Record<string, string> = {
  tokyo: "도쿄",
  osaka: "오사카",
  fukuoka: "후쿠오카",
  sapporo: "삿포로",
  nagoya: "나고야",
  okinawa: "오키나와",
  takamatsu: "다카마쓰",
  matsuyama: "마쓰야마",
};

/**
 * URL 슬러기 또는 한글명을 받아 안전한 한글 도시명으로 변환
 * @param slugOrName 영문 슬러그 또는 한글 도시명
 * @returns 한글 도시명 (기본값: '도쿄')
 */
export const resolveCityKoreanName = (slugOrName?: string): string => {
  if (!slugOrName) return "도쿄";
  const lower = slugOrName.toLowerCase();
  return CITY_SLUG_MAP[lower] || slugOrName;
};

/**
 * 한글 도시명을 받아 깔끔한 영문 URL 슬러그로 변환
 * @param koreanName 한글 도시명
 * @returns 영문 소문자 슬러기
 */
export const getCitySlug = (koreanName: string): string => {
  const entry = Object.entries(CITY_SLUG_MAP).find(
    ([_, kor]) => kor === koreanName,
  );
  return entry ? entry[0] : koreanName.toLowerCase();
};

/**
 * 영문 슬러그든 한글명이든 무조건 안전한 도시 정보를 변환
 * @param slugOrName 영문 슬러그 또는 한글 도시명
 * @returns 100% 안전한 CityDetailInfo 객체 (절대 undefined가 되지 않도록)
 */
export const getCityInfo = (slugOrName?: string): CityDetailInfo => {
  const korName = resolveCityKoreanName(slugOrName);
  return JAPAN_CITIES_DATA[korName] || JAPAN_CITIES_DATA["도쿄"];
};

// 일본 특화 인기 검색 태그 칩
export const POPULAR_SEARCH_KEYWORDS = [
  "도쿄",
  "오사카",
  "후쿠오카",
  "나고야",
  "오키나와",
  "다카마쓰",
  "마쓰야마",
  "도쿄 타워",
  "도톤보리",
  "유니버셜 스튜디오",
] as const;

/**
 * 여행 상태 실시간 판별 함수
 * @param startDateStr 여행 시작일 (YYYY-MM-DD)
 * @param endDateStr 여행 종료일 (YYYY-MM-DD)
 * @returns 'D-20' | '오늘은 여행 1일차' | '' (종료 후)
 */
export const getTravelStatusText = (
  startDateStr?: string,
  endDateStr?: string,
): string => {
  if (!startDateStr || !endDateStr) return "설레는 여행 준비!";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDateStr);
  end.setHours(0, 0, 0, 0);

  const diffStart =
    Math.ceil(start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  const diffEnd = Math.ceil(
    end.getTime() - today.getTime() / (1000 * 60 * 60 * 24),
  );

  // 여행 시작 전
  if (diffStart > 0) return `D-${diffStart}`;

  // 여행 진행 중
  if (diffStart <= 0 && diffEnd >= 0) {
    const currentDayNumber = Math.abs(diffStart) + 1;
    return `오늘은 여행 ${currentDayNumber}일차`;
  }

  // 여행 종료 후
  return "";
};

/**
 * 단순 D-DAY 계산 함수
 * @param startDateStr 목료 시작일 (YYYY-MM-DD)
 * @returns 'D-Day' | 'D-N' | 'D+N'
 */
export const calculateDDay = (startDateStr?: string): string => {
  if (!startDateStr) return "D-Day";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(startDateStr);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "D-Day";
  if (diffDays > 0) return `D-${diffDays}`;

  return `D+${Math.abs(diffDays)}`;
};

/**
 * 여행 진행 여부 판별 함수
 * @param endDateStr 여행 종료일 (YYYY-MM-DD)
 * @returns 진행 중이거나 예정된 여행이면 true, 이미 끝난 여행이면 false
 */
export const isActiveTravelPlan = (endDateStr?: string): boolean => {
  if (!endDateStr) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(endDateStr);
  end.setHours(0, 0, 0, 0);

  return end >= today;
};

/**
 * 여행 날짜를 예쁘게 변환해주는 함수
 * @param startDateStr 시작일 (YYYY-MM-DD)
 * @param endDateStr 종료일 (YYYY-MM-DD)
 * @returns 'M.D(요일) - M.D(요일)'
 */
export const formatTravelDates = (
  startDateStr?: string,
  endDateStr?: string,
): string => {
  if (!startDateStr || !endDateStr) return "";

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  const startFormatted = `${start.getMonth() + 1}.${start.getDate()}(${days[start.getDay()]})`;
  const endFormatted = `${end.getMonth() + 1}.${end.getDate()}(${days[end.getDay()]})`;

  return `${startFormatted} - ${endFormatted}`;
};

// 일본 8대 지원 도시 상세 가이드 인터페이스
export interface CityDetailInfo {
  title: string;
  engName: string;
  slug: string;
  description: string;
  imageUrl: string;
  flightTime: string;
  visa: string;
  currency: string;
  voltage: string;
  timezone: string;
  recommendSeason: string;
  tips: string[];
}

// 전역 공통 일본 8대 도시 데이터베이스
export const JAPAN_CITIES_DATA: Record<string, CityDetailInfo> = {
  도쿄: {
    title: "도쿄",
    engName: "Tokyo",
    slug: "tokyo",
    description:
      "전통과 첨단 문명이 함께 숨 쉬는 일본의 심장부. 맛있는 음식, 감각적인 쇼핑, 눈부신 도심 야경이 매일 새롭게 펼쳐지는 아시아 최고의 메가시티입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1000&q=80",
    flightTime: "약 2시간 10분 (직항)",
    visa: "90일 무비자",
    currency: "엔화 (JPY, 100엔 ≒ 910원)",
    voltage: "100V / 50Hz (11자 돼지코 어댑터 필수)",
    timezone: "한국과 시차 없음 (UTC+9)",
    recommendSeason: "3월~5월 (벚꽃), 10월~11월 (단풍)",
    tips: [
      "도쿄 메트로 24/48/72시간 패스를 이용하면 지하철 요금을 대폭 절약할 수 있습니다.",
      "시부야 스크램블 교차로와 시부야 스카이 전망대는 일몰 1시간 전 방문을 추천합니다.",
      "스시는 츠키지 장외시장이나 긴자 맛집에서 현지 분위기를 즐겨보세요.",
    ],
  },
  오사카: {
    title: "오사카",
    engName: "Osaka",
    slug: "osaka",
    description:
      "천하의 부엌이라 불리는 식도락의 천국. 도톤보리의 화려한 글리코상 네온사인과 활기찬 현지 분위기, 맛있는 타코야키와 오코노미야키가 쉼 없이 오감을 자극합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1590250767139-4d6b63ca44be?auto=format&fit=crop&w=1000&q=80",
    flightTime: "약 1시간 40분 (직항)",
    visa: "90일 무비자",
    currency: "엔화 (JPY)",
    voltage: "100V / 60Hz (11자 돼지코 어댑터 필수)",
    timezone: "한국과 시차 없음 (UTC+9)",
    recommendSeason: "4월 (벚꽃), 10월~11월 (미식의 가을)",
    tips: [
      "오사카 주유패스(Amazing Pass)로 시내 주요 관광지 무료입장 및 지하철 무제한 탑승이 가능합니다.",
      "유니버셜 스튜디오 재팬(USJ)은 닌텐도 월드 확약권(익스프레스) 사전 예매가 필수입니다.",
      "근교 교토와 고베, 나라까지 한큐/한신 패스로 당일치기 여행을 즐겨보세요.",
    ],
  },
  후쿠오카: {
    title: "후쿠오카",
    engName: "Fukuoka",
    slug: "fukuoka",
    description:
      "공항과 도심(하카타)이 지하철로 단 5분 거리인 최고의 힐링 여행지. 깊고 진한 하카타 돈코츠 라멘과 나카스 포장마차(야타이) 거리의 따스한 감성이 매력적입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    flightTime: "약 1시간 15분 (직항)",
    visa: "90일 무비자",
    currency: "엔화 (JPY)",
    voltage: "100V / 60Hz (11자 돼지코 어댑터 필수)",
    timezone: "한국과 시차 없음 (UTC+9)",
    recommendSeason: "11월~2월 (겨울 온천 & 미식)",
    tips: [
      "후쿠오카 공항에서 하카타역까지 지하철로 단 2정거장(5분)입니다.",
      "유후인, 벳푸 온천마을은 유후인노모리 관광열차나 고속버스로 다녀오기 좋습니다.",
      "모모치 해변과 후쿠오카 타워의 야경은 필수 포토존입니다.",
    ],
  },
  삿포로: {
    title: "삿포로",
    engName: "Sapporo",
    slug: "sapporo",
    description:
      "겨울에는 은빛 눈꽃 축제가 열리고 여름에는 시원한 라벤더 언덕과 맥주 축제가 열리는 홋카이도의 보석. 신선한 털게요리와 징기스칸 양고기, 그리고 환상적인 설경이 기다립니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&w=1000&q=80",
    flightTime: "약 2시간 40분 (직항)",
    visa: "90일 무비자",
    currency: "엔화 (JPY)",
    voltage: "100V / 50Hz (11자 돼지코 어댑터 필수)",
    timezone: "한국과 시차 없음 (UTC+9)",
    recommendSeason: "12월~2월 (눈축제), 7월~8월 (라벤더/여름 피서)",
    tips: [
      "비에이 & 후라노 흰수염폭포와 크리스마스트리 투어는 1일 버스투어를 추천합니다.",
      "삿포로 맥주 박물관에서 갓 따른 3종 생맥주 시음은 놓치지 마세요.",
      "겨울철 눈길 미끄럼 방지를 위해 신발용 아이젠을 편의점에서 구매하면 편리합니다.",
    ],
  },
  나고야: {
    title: "나고야",
    engName: "Nagoya",
    slug: "nagoya",
    description:
      "도쿄와 오사카 사이에 위치한 일본 중부의 중심 도시. 나고야성과 지브리 파크, 그리고 히츠마부시(장어덮밥)와 테바사키(닭날개튀김) 등 독창적인 미식 문화(나고야메시)를 자랑합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1583084957819-99c8aa90dd52?auto=format&fit=crop&w=1000&q=80",
    flightTime: "약 1시간 50분 (직항)",
    visa: "90일 무비자",
    currency: "엔화 (JPY)",
    voltage: "100V / 60Hz (11자 돼지코 어댑터 필수)",
    timezone: "한국과 시차 없음 (UTC+9)",
    recommendSeason: "4월~5월 (봄), 10월~11월 (가을)",
    tips: [
      "지브리 파크는 100% 사전 예약제이므로 최소 2달 전 티켓팅이 필수입니다.",
      "아침에는 카페에서 커피를 시키면 토스트와 계란이 무료로 나오는 '모닝 서비스'를 경험해보세요.",
      "근교 시라카와고 합장촌 갓쇼즈쿠리 마을은 당일치기 버스로 다녀올 수 있습니다.",
    ],
  },
  오키나와: {
    title: "오키나와",
    engName: "Okinawa",
    slug: "okinawa",
    description:
      "에메랄드빛 바다와 따스한 햇살이 반겨주는 동양의 하와이. 츄라우미 수족관, 푸른 동굴 스노클링, 아메리칸 빌리지 등 이국적인 휴양의 매력을 만끽할 수 있습니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1000&q=80",
    flightTime: "약 2시간 15분 (직항)",
    visa: "90일 무비자",
    currency: "엔화 (JPY)",
    voltage: "100V / 60Hz (11자 돼지코 어댑터 필수)",
    timezone: "한국과 시차 없음 (UTC+9)",
    recommendSeason: "5월~10월 (해양 스포츠/물놀이 최적기)",
    tips: [
      "오키나와 본도는 대중교통이 제한적이므로 렌터카 여행을 강력 추천합니다.",
      "국제거리 포장마차촌에서 오키나와 오리온 생맥주와 바다포도(우미부도)를 맛보세요.",
      "츄라우미 수족관의 거대한 고래상어 피딩 타임(15:00, 17:00)을 미리 확인하세요.",
    ],
  },
  다카마쓰: {
    title: "다카마쓰",
    engName: "Takamatsu",
    slug: "takamatsu",
    description:
      "사누키 우동의 본고장이자 세토내해 예술의 섬들로 향하는 관문 도시. 미슐랭 3스타 리츠린 공원의 고즈넉한 정원과 나오시마, 쇼도시마 섬 예술 여행을 만끽할 수 있습니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    flightTime: "약 1시간 35분 (직항)",
    visa: "90일 무비자",
    currency: "엔화 (JPY)",
    voltage: "100V / 60Hz (11자 돼지코 어댑터 필수)",
    timezone: "한국과 시차 없음 (UTC+9)",
    recommendSeason: "3월~5월 (봄), 9월~11월 (가을)",
    tips: [
      "우동 버스나 우동 택시를 이용하면 외곽의 숨은 전통 사누키 우동 명가들을 투어할 수 있습니다.",
      "리츠린 공원은 아침 일찍 방문해 조용한 찻집(고게츠테이)에서 말차를 즐겨보세요.",
      "나오시마 노란호박과 지중미술관을 가려면 페리 시간표를 사전에 꼭 확인하세요.",
    ],
  },
  마쓰야마: {
    title: "마쓰야마",
    engName: "Matsuyama",
    slug: "matsuyama",
    description:
      "3,000년 역사를 지닌 도고 온천과 웅장한 마쓰야마성이 있는 낭만 소도시. '센과 치히로의 행방불명' 모티브가 된 유서 깊은 온천 본관과 봇짱 봇짱 열차가 아늑한 감성을 선사합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1573456373835-579c408de263?auto=format&fit=crop&w=1000&q=80",
    flightTime: "약 1시간 30분 (직항)",
    visa: "90일 무비자",
    currency: "엔화 (JPY)",
    voltage: "100V / 60Hz (11자 돼지코 어댑터 필수)",
    timezone: "한국과 시차 없음 (UTC+9)",
    recommendSeason: "10월~3월 (온천 힐링 시즌)",
    tips: [
      "한국인 관광객 전용 무료 셔틀버스 및 주요 관광지 무료입장 쿠폰북을 공항에서 수령하세요.",
      "도고 온천 본관에서 유카타를 입고 온천욕과 차를 즐기는 힐링 코스를 추천합니다.",
      "감귤(미캉)이 유명하여 수도꼭지에서 감귤 주스가 나오는 독특한 체험을 할 수 있습니다.",
    ],
  },
};
