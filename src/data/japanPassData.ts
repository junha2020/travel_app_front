export interface JapanPassItem {
  id: string;
  name: string;
  city: string;
  category: "교통패스" | "테마파크" | "전망대" | "투어" | "전시";
  price: number;
  originalPrice: number;
  discountRate: string;
  rating: string;
  reviewCount: string;
  imageUrl: string;
  tags: string[];
  bookingUrl: string;
  platform: "Klook" | "KKday" | "WAUG";
  bestBadge?: string;
  description: string;
}

export const JAPAN_TOP_PASSES: JapanPassItem[] = [
  {
    id: "tokyo-subway",
    name: "도쿄 지하철 24/48/72시간 무제한 탑승 패스",
    city: "도쿄",
    category: "교통패스",
    price: 8500,
    originalPrice: 10000,
    discountRate: "15%",
    rating: "4.9",
    reviewCount: "48,200+",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
    tags: ["모바일 바우처", "당일 이용", "필수 교통"],
    bookingUrl: "https://www.klook.com/ko/activity/1552-subway-ticket-tokyo/",
    platform: "Klook",
    bestBadge: "판매 1위 🏆",
    description:
      "도쿄 메트로와 토에이 지하철 전 노선을 지정된 시간 동안 무제한 탑승할 수 있는 도쿄 여행 최고의 가성비 패스입니다.",
  },
  {
    id: "shibuya-sky",
    name: "도쿄 시부야 스카이 전망대 입장권",
    city: "도쿄",
    category: "전망대",
    price: 22000,
    originalPrice: 25000,
    discountRate: "12%",
    rating: "4.9",
    reviewCount: "32,100+",
    imageUrl:
      "https://images.unsplash.com/photo-1573456373835-579c408de263?auto=format&fit=crop&w=400&q=80",
    tags: ["일몰 시간대 인기", "즉시 확정", "인생샷 명소"],
    bookingUrl: "https://www.klook.com/ko/activity/70672-shibuya-sky-tokyo/",
    platform: "Klook",
    bestBadge: "인기 폭발 🔥",
    description:
      "지상 229m 높이에서 도쿄 타워, 후지산, 시부야 스크램블 교차로를 360도 파노라마로 감상하는 가장 핫한 전망대입니다.",
  },
  {
    id: "skyliner",
    name: "도쿄 나리타 공항 스카이라이너 고속열차 편도/왕복권",
    city: "도쿄",
    category: "교통패스",
    price: 21500,
    originalPrice: 24000,
    discountRate: "10%",
    rating: "4.8",
    reviewCount: "25,400+",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
    tags: ["공항 이동 36분", "좌석 지정", "QR 즉시 교환"],
    bookingUrl: "https://www.klook.com/ko/activity/1410-skyliner-tokyo/",
    platform: "Klook",
    description:
      "나리타 공항에서 도쿄 도심(우에노/닛포리)까지 단 36분 만에 주파하는 초고속 특급열차 티켓입니다.",
  },
  {
    id: "harry-potter",
    name: "도쿄 워너 브라더스 해리포터 스튜디오 투어",
    city: "도쿄",
    category: "테마파크",
    price: 58000,
    originalPrice: 63000,
    discountRate: "8%",
    rating: "4.9",
    reviewCount: "19,800+",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    tags: ["아시아 최초", "버터맥주 체험", "사전예약 필수"],
    bookingUrl:
      "https://www.klook.com/ko/activity/84374-warner-bros-studio-tour-tokyo-making-harry-potter/",
    platform: "Klook",
    description:
      "해리포터 영화 속 호그와트 대연회장, 다이애건 앨리, 9와 4분의 3 승강장을 직접 걷고 체험하는 마법 같은 테마파크입니다.",
  },
  {
    id: "teamlab-planets",
    name: "도쿄 팀랩 플래닛 TOKYO 몰입형 디지털 아트 전시",
    city: "도쿄",
    category: "전시",
    price: 34500,
    originalPrice: 38000,
    discountRate: "9%",
    rating: "4.8",
    reviewCount: "28,900+",
    imageUrl:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80",
    tags: ["물속을 걷는 예술", "맨발 체험", "인스타 핫플"],
    bookingUrl:
      "https://www.klook.com/ko/activity/22320-teamlab-planets-toyosu-tokyo/",
    platform: "Klook",
    description:
      "물속으로 직접 들어가 환상적인 빛과 인터랙티브 아트를 온몸으로 느끼는 세계적인 디지털 아트 뮤지엄입니다.",
  },
  {
    id: "usj-osaka",
    name: "오사카 유니버설 스튜디오 재팬 1일 스튜디오 패스",
    city: "오사카",
    category: "테마파크",
    price: 84000,
    originalPrice: 89000,
    discountRate: "6%",
    rating: "4.9",
    reviewCount: "95,000+",
    imageUrl:
      "https://images.unsplash.com/photo-1749498693255-f01404fe0b51?auto=format&fit=crop&w=400&q=80",
    tags: ["슈퍼 닌텐도 월드", "QR 즉시 입장", "공식 파트너"],
    bookingUrl:
      "https://www.klook.com/ko/activity/465-universal-studios-japan-ticket-osaka/",
    platform: "Klook",
    bestBadge: "오사카 필수 🌟",
    description:
      "슈퍼 마리오 닌텐도 월드, 해리포터 마법 세계, 쥐라기 파크 등 세계 최고의 어트랙션이 가득한 테마파크입니다.",
  },
  {
    id: "osaka-amazing-pass",
    name: "오사카 주유패스 / e-Pass 1일 & 2일권",
    city: "오사카",
    category: "교통패스",
    price: 28000,
    originalPrice: 31000,
    discountRate: "10%",
    rating: "4.8",
    reviewCount: "54,200+",
    imageUrl:
      "https://images.unsplash.com/photo-1590250767139-4d6b63ca44be?auto=format&fit=crop&w=400&q=80",
    tags: ["오사카성 무료", "우메다 공중정원", "지하철 무제한"],
    bookingUrl:
      "https://www.klook.com/ko/activity/1323-osaka-amazing-pass-osaka/",
    platform: "Klook",
    description:
      "오사카 시내 지하철 무제한 탑승과 오사카성, 우메다 공중정원, 헵파이브 관람차 등 40여 개 관광지 무료입장이 가능한 패스입니다.",
  },
  {
    id: "haruka-express",
    name: "오사카 간사이 공항 하루카 특급열차 티켓 (교토 직행)",
    city: "오사카",
    category: "교통패스",
    price: 16500,
    originalPrice: 18500,
    discountRate: "11%",
    rating: "4.9",
    reviewCount: "38,700+",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
    tags: ["헬로키티 열차", "간사이-교토 75분", "모바일 발권"],
    bookingUrl:
      "https://www.klook.com/ko/activity/18350-haruka-airport-express-ticket-osaka/",
    platform: "Klook",
    description:
      "간사이 공항에서 신오사카, 텐노지, 교토역까지 환승 없이 가장 빠르고 쾌적하게 이동하는 특급열차입니다.",
  },
  {
    id: "sunq-pass",
    name: "후쿠오카 북큐슈 산큐패스 3일권 (고속버스 무제한)",
    city: "후쿠오카",
    category: "교통패스",
    price: 82000,
    originalPrice: 90000,
    discountRate: "9%",
    rating: "4.8",
    reviewCount: "12,400+",
    imageUrl:
      "https://images.unsplash.com/photo-1701819313872-fd59bad7acfa?auto=format&fit=crop&w=400&q=80",
    tags: ["유후인/벳푸/하카타", "시내버스 포함", "자유 승하차"],
    bookingUrl: "https://www.kkday.com/ko/product/18585",
    platform: "KKday",
    description:
      "후쿠오카, 유후인, 벳푸, 구마모토, 나가사키 등 북큐슈 전역의 고속버스와 시내버스를 3일간 무제한 탑승할 수 있습니다.",
  },
  {
    id: "yufuin-tour",
    name: "후쿠오카 출발 유후인 & 벳푸 & 다자이후 1일 버스투어",
    city: "후쿠오카",
    category: "투어",
    price: 59000,
    originalPrice: 65000,
    discountRate: "9%",
    rating: "4.9",
    reviewCount: "15,800+",
    imageUrl:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80",
    tags: ["한국어 가이드", "온천욕 가능", "하카타역 출도착"],
    bookingUrl:
      "https://www.klook.com/ko/activity/16075-dazaifu-yufuin-beppu-day-tour-fukuoka/",
    platform: "Klook",
    bestBadge: "후쿠오카 1위 🥇",
    description:
      "학문의 신을 모신 다자이후 텐만구부터 긴린코 호수의 유후인, 벳푸 지옥온천까지 전용 버스로 편안하게 즐기는 1일 투어입니다.",
  },
  {
    id: "biei-tour",
    name: "삿포로 비에이 & 후라노 사계채의 언덕 1일 버스투어",
    city: "삿포로",
    category: "투어",
    price: 65000,
    originalPrice: 72000,
    discountRate: "10%",
    rating: "4.9",
    reviewCount: "21,300+",
    imageUrl:
      "https://images.unsplash.com/photo-1671616771884-43ace9cbe2bf?auto=format&fit=crop&w=400&q=80",
    tags: ["크리스마스트리", "흰수염폭포", "청의 호수"],
    bookingUrl:
      "https://www.klook.com/ko/activity/17397-biei-furano-day-tour-sapporo/",
    platform: "Klook",
    bestBadge: "홋카이도 필수 ❄️",
    description:
      "동화 같은 비에이 청의 호수, 흰수염폭포, 크리스마스트리, 닝구르테라스를 한국어 가이드와 함께 돌아보는 홋카이도 시그니처 투어입니다.",
  },
  {
    id: "okinawa-churaumi-tour",
    name: "오키나와 츄라우미 수족관 & 만좌모 북부 1일 버스투어",
    city: "오키나와",
    category: "투어",
    price: 54000,
    originalPrice: 60000,
    discountRate: "10%",
    rating: "4.8",
    reviewCount: "16,200+",
    imageUrl:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&q=80",
    tags: ["수족관 입장권 포함", "코우리 대교", "뚜벅이 필수"],
    bookingUrl:
      "https://www.klook.com/ko/activity/1126-hip-hop-bus-day-tour-okinawa/",
    platform: "Klook",
    description:
      "렌터카 없이도 츄라우미 수족관의 고래상어와 코우리 섬, 만좌모 절경을 하루 만에 알차게 둘러볼 수 있는 버스투어입니다.",
  },
];

/**
 * 특정 도시의 패스/티켓 목록 필터링
 * @param cityName 한글 도시명 (ex) 도쿄, 오사카)
 * @returns 해당 도시의 JapanPassItem 배열
 */
export const getPassesByCity = (cityName: string): JapanPassItem[] => {
  return JAPAN_TOP_PASSES.filter(
    (p) => p.city.includes(cityName) || cityName.includes(p.city),
  );
};

/**
 * 할인율 가장 높은 TOP N개 패스 추출
 * @param limit 가져올 개수 (기본값: 4)
 */
export const getTopDiscountPasses = (limit = 4): JapanPassItem[] => {
  return [...JAPAN_TOP_PASSES]
    .sort((a, b) => parseInt(b.discountRate) - parseInt(a.discountRate))
    .slice(0, limit);
};

/**
 * 특정 ID의 패스 상세 정보 조회
 * @param id 패스 고유 ID
 */
export const getPassById = (id: string): JapanPassItem | undefined => {
  return JAPAN_TOP_PASSES.find((p) => p.id === id);
};
