<div align="center">

# ⚔️ KDA.KR : 리그 오브 레전드 프리미엄 전적 검색 서비스

**Riot Games API 기반 소환사 전적 조회, 5축 플레이스타일 방사형 분석 & 인게임 10인 딜량 시각화 플랫폼**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-TTL_Cache-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

[**📖 포트폴리오 상세 문서 바로가기 (PORTFOLIO.md)**](./PORTFOLIO.md)

</div>

---

## ✨ 핵심 기능

- **Riot ID(소환사명#태그) 검색 및 자동 보정**: `#태그` 미입력 시 `#KR1` 자동 보정 및 최근 검색 기록 저장.
- **실시간 티어 및 20경기 종합 통계**: 솔로랭크/자유랭크 티어 배지, 20경기 승률, 평균 KDA, 킬 관여율(KP%), 팀 딜 비중 계산.
- **5축 플레이스타일 방사형 차트 (Recharts)**: 라인전, 한타력, 시야 점수, 오브젝트, 딜량 기여도 5축 시각화.
- **모스트 챔피언 TOP 3 & 큐 타입 필터**: 선호 챔피언 KDA/승률 집계 및 솔랭/자랭/칼바람 큐별 전적 필터링.
- **10인 인게임 딜량 & 빌드 비교 아코디언**: 블루/레드 10인 소환사의 상대적 딜량 게이지 바와 7종 아이템 트리 대조.
- **원클릭 실시간 전적 갱신**: 리그 캐시 즉시 무효화 후 최신 데이터 동기화.
- **Graceful Degradation (고가용성 모의 데이터)**: Riot API 키 미설정/만료/Rate Limit 시 현실적인 모의 전적 데이터 자동 폴백.

---

## 🏛 기술적 특징 & 최적화

1. **MongoDB Atlas 3단계 계층 캐싱 (TTL Index)**
   - `AccountCache` (30일), `LeagueCache` (15분), `MatchCache` (30일)
   - 외부 API 호출 횟수를 90% 이상 절감하여 Rate Limit 회피
2. **데이터 다이어트 (Data Pruning)**
   - 경기당 200KB 이상의 원본 Match JSON을 약 15KB로 90% 압축 저장
3. **배치 청크 병렬 처리**
   - 최근 20경기 매치 상세 조회를 5개씩 청크 분할(`Promise.all`)하여 로딩 지연 최소화
4. **Mongoose Serverless Singleton**
   - Node.js global 객체를 활용해 Next.js 서버리스 환경에서 커넥션 누수 방지
5. **Docker Multi-stage & Standalone 경량화**
   - Alpine Linux 기반 3단계 멀티스테이지 빌드로 컨테이너 이미지 크기 최소화

---

## 🚀 시작하기

### 1. 환경 변수 설정 (`.env.local`)
```env
RIOT_API_KEY=RGAPI-your-riot-api-key
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kda-kr?retryWrites=true&w=majority
```
> ※ Riot API 키나 MongoDB 연결이 없어도 시뮬레이션 모의 데이터 모드로 전체 기능이 정상 작동합니다.

### 2. 설치 및 실행
```bash
npm install
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

### 3. Docker로 실행
```bash
docker compose up -d --build
```

---

## 📄 라이선스 & 법적 고지
KDA.KR isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.

