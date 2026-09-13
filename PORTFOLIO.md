# 🏆 KDA.KR : 리그 오브 레전드 프리미엄 전적 검색 및 데이터 분석 플랫폼
> **Riot Games API를 활용한 소환사 전적 조회, 5축 플레이스타일 방사형 분석 및 인게임 10인 딜량 시각화 풀스택 웹 서비스**

---

## 📌 1. 프로젝트 개요 (Overview)

| 항목 | 내용 |
| :--- | :--- |
| **프로젝트명** | **KDA.KR** (케이디에이 코리아) |
| **서비스 형태** | 웹 애플리케이션 (반응형 웹, 데스크톱/모바일 최적화) |
| **개발 기간** | 2026.08 ~ 2026.09 (지속적 기능 고도화) |
| **개발 인원** | 1인 풀스택 개발 (기획, UI/UX 디자인, 프론트엔드, 백엔드 API, 캐싱/인프라 설계) |
| **주요 목적** | 실시간 Riot Games API 기반 전적 검색 및 Recharts 기반 데이터 시각화를 통해 사용자의 플레이 성향과 게임 통계를 직관적으로 분석할 수 있는 프리미엄 전적 플랫폼 구축 |
| **배포 환경** | Docker (Standalone Multi-stage), Docker Compose, PM2, Nginx Reverse Proxy |

---

## 🛠 2. 기술 스택 (Tech Stack)

### Frontend
- **Framework**: `Next.js 16.3.0` (App Router, React Server Component & Client Component 분리)
- **Library**: `React 19.2.8`, `TypeScript 7`
- **Styling**: `TailwindCSS v4` (모던 다크 모드 테마, 글래스모피즘, 커스텀 유틸리티)
- **Data Visualization**: `Recharts 3.10.1` (5축 플레이스타일 Radar Chart)
- **Icons**: `Lucide React`

### Backend & Database
- **Server**: Next.js Route Handlers (Edge/Serverless API)
- **Database**: `MongoDB Atlas` (Cloud NoSQL Database)
- **ODM**: `Mongoose 9.9.1` (TTL Index 기반 계층형 캐시 및 로그 수집)
- **External APIs**:
  - Riot Games API: `Account-V1`, `Summoner-V4`, `League-V4`, `Match-V5`
  - Riot Data Dragon (ddragon): 최신 챔피언, 룬, 아이템, 스펠, 소환사 아이콘 메타데이터 동기화

### DevOps & Infrastructure
- **Containerization**: `Docker` (Alpine Linux 기반 멀티스테이지 빌드), `Docker Compose`
- **Process Manager**: `PM2` (`ecosystem.config.js` 클러스터/포크 관리)
- **Network & CI/CD**: 고정 IP VLAN 연동, 리버스 프록시 대응(`allowedDevOrigins` 설정)

---

## 🎯 3. 핵심 기능 (Key Features)

### 1) Riot ID(소환사명#태그) 검색 및 스마트 자동 보정
- **Riot 신규 체계 완벽 지원**: `소환사명#태그` 형태의 Riot ID 검색 지원.
- **스마트 태그 보정**: `#태그` 미입력 시 국내 기본값인 `#KR1` 자동 부여 및 인코딩 처리.
- **최근 검색어 관리**: `LocalStorage` 기반 최근 검색 소환사 히스토리 저장/삭제(최대 5건).
- **실시간 인기 소환사 추천**: 메인 화면 및 검색 드롭다운에 Faker(`Hide on bush`), Chovy 등 인기 챌린저 소환사 퀵 링크 제공.

### 2) 소환사 종합 프로필 & 티어 대시보드
- **솔로 랭크 / 자유 랭크 티어 배지**: 현재 티어, 세부 랭크, LP(리그 포인트), 승/패 및 승률 시각화.
- **최근 20경기 누적 성적 요약**:
  - 승/패 횟수 및 승률 프로그레스 바.
  - 평균 KDA (Kill/Death/Assist) 정밀 계산.
  - 팀 내 평균 킬 관여율(KP%) 및 평균 피해량 점유율(Damage Share%) 산출.
- **모스트 선호 챔피언 TOP 3**:
  - 챔피언별 판수, 승률, KDA 실시간 정렬 및 뱃지 표시.

### 3) 5축 플레이스타일 방사형 차트 (Radar Chart)
- **플레이 성향 시각화**: 최근 20경기 인게임 지표를 정규화하여 5개 축으로 분석:
  - **라인전**: 초반 승률 및 킬 관여도 기반 환산
  - **한타력**: 평균 킬 관여율(KP%) 가중치 환산
  - **시야 점수**: 분당 와드 설치 및 시야 점수 가중치 환산
  - **오브젝트**: 드래곤/바론 획득 기여율 환산
  - **딜량 비중**: 팀 내 총 딜량 대비 개인 기여도(Damage Share%) 환산

### 4) 매치 히스토리 및 큐 타입별 필터링
- **큐 타입 필터**: 전체 매치 / 솔로랭크(420) / 자유랭크(440) / 칼바람 나락(450) 즉각 필터링.
- **승/패 카드 UI**: 승리(블루 테마)와 패배(레드 테마) 시각적 대비.
- **핵심 정보 요약**: 플레이 챔피언 레벨, 소환사 주문(스펠), 룬, 7개 최종 아이템 빌드, KDA, CS(분당 CS), 경기 진행 시간.

### 5) 10인 인게임 상세 비교 아코디언 (Match Detail Accordion)
- **DeepLoL/OP.GG 스타일의 인게임 10인 비교**:
  - 블루팀 vs 레드팀 10인 소환사의 딜량 게이지 바(최고 딜러 기준 상대적 백분율 시각화).
  - 소환사별 KDA, 딜량 수치, 데미지 점유율, 아이템 빌드 한눈에 대조.

### 6) 원클릭 실시간 전적 갱신 (Cache Revalidation)
- 소환사 페이지 상단 `전적 갱신` 버튼 클릭 시 해당 소환사의 League Cache를 즉시 무효화하고 최신 랭크 정보와 매치 기록을 새로고침.

---

## 💡 4. 아키텍처 및 데이터 흐름도 (System Architecture)

```mermaid
flowchart TD
    User([사용자 브라우저]) -->|1. 검색 요청 (소환사명#태그)| NextApp[Next.js App Router]
    NextApp -->|2. Route Handler 호출| API["/api/summoner/[nameTag]"]
    
    subgraph CachingLayer [MongoDB Atlas 계층형 캐시]
        API -->|3-1. Account 조회| AccountCache[(AccountCache / TTL 30일)]
        API -->|4-1. League/Rank 조회| LeagueCache[(LeagueCache / TTL 15분)]
        API -->|5-1. Match Detail 조회| MatchCache[(MatchCache / TTL 30일)]
    end

    subgraph RiotAPILayer [Riot Games External API]
        API -.->|3-2. Cache Miss: Account-V1| RiotAccount[Riot Account-V1 API]
        API -.->|4-2. Cache Miss: Summoner/League-V4| RiotLeague[Riot League-V4 API]
        API -.->|5-2. Cache Miss: Match-V5| RiotMatch[Riot Match-V5 API]
        NextApp -.->|Data Dragon 동기화| DDragon[Data Dragon CDN]
    end

    subgraph PruningAndAnalytics [데이터 가공 & 분석 엔진]
        RiotMatch -->|매치 JSON 원본| Pruner[Data Pruning Helper]
        Pruner -->|90% 압축 (약 15KB)| MatchCache
        Pruner -->|KP%, 딜 점유율 계산| AnalyticsEngine[플레이스타일/통계 산출]
    end

    subgraph HighAvailability [고가용성 폴백]
        API -.->|API Key 미설정 / Rate Limit 발생 시| MockEngine[generateMockProfile]
    end

    AnalyticsEngine --> NextApp
    MockEngine --> NextApp
    NextApp -->|6. 반응형 UI & Radar 차트 렌더링| User
```

---

## ⚡ 5. 기술적 도전 과제 및 문제 해결 (Troubleshooting & Engineering Decisions)

### 1) Riot API의 엄격한 Rate Limit 대응 및 3단계 계층 캐싱
- **문제점**:
  - Riot API(Personal/Development Key)는 **1초당 20회, 2분당 100회**라는 엄격한 호출 제한이 있습니다.
  - 소환사 1회 검색 시 `Account -> Summoner -> League -> MatchIDs(20개) -> MatchDetail(20개)`로 총 **23회 이상의 API 요청**이 발생하여 즉시 `429 Too Many Requests`가 발생하고 페이지 로딩이 5~10초 이상 지연되는 병목이 있었습니다.
- **해결책**:
  1. **MongoDB Atlas 기반 3단계 계층 캐시 전략 설계**:
     - **AccountCache (TTL 30일)**: `riotIdKey` (소환사명#태그 소문자) $\rightarrow$ `puuid` 매핑. 불변에 가까우므로 30일 장기 보관.
     - **LeagueCache (TTL 15분)**: 티어, LP, 승/패 등 변동성이 있는 데이터는 15분 보관 (소환사가 `전적 갱신` 버튼 클릭 시 즉시 강제 삭제).
     - **MatchCache (TTL 30일)**: 이미 종료된 게임의 경기 상세 데이터는 영구 불변이므로 30일 캐싱.
  2. **청크 단위 배치 병렬 요청 (`batchSize: 5`)**:
     - 20개의 매치를 한 번에 `Promise.all`로 호출하면 순간 버스트 제한에 걸리고, 1개씩 순차 호출하면 극심한 네트워크 워터폴(Waterfall)이 발생합니다.
     - 5개씩 청크 분할(`batchSize: 5`)하여 점진적 병렬 요청을 수행함으로써 Rate Limit 초과를 원천 차단하고 응답 속도를 대폭 개선했습니다.

### 2) 데이터 다이어트 (Data Pruning)를 통한 캐시 용량 90% 절감
- **문제점**:
  - Riot `Match-V5` 원본 응답 JSON은 타임라인, 프레임 통계, 모든 룬 서브트리 등 수백 개의 필드를 포함하여 **1경기당 약 150KB ~ 300KB**에 달했습니다.
  - 매치 20개를 그대로 DB에 캐싱할 경우 소환사 1명당 4~6MB의 용량이 발생하여 MongoDB Atlas 무료 티어 용량(512MB)이 조기 고갈될 위험이 있었습니다.
- **해결책**:
  - `pruneMatchData` 가공 헬퍼 함수를 설계하여 UI 렌더링에 반드시 필요한 팀 오브젝트(바론, 드래곤, 타워), 10인의 핵심 정보(KDA, 딜량, 아이템, 주요 룬, 스펠, 골드, CS)만 추출.
  - 팀 총합 딜량 및 킬 수를 기반으로 **킬 관여율(KP%)** 및 **팀 내 딜 지분(Damage Share%)**을 백엔드에서 미리 계산하여 주입.
  - 결과적으로 매치 1건당 JSON 크기를 **약 15KB로 90% 이상 경량화**하여 DB 저장 효율과 네트워크 전송 속도를 극대화했습니다.

### 3) Graceful Degradation (무중단 데모를 위한 고가용성 모의 데이터 폴백)
- **문제점**:
  - Riot 개발용 API 키는 24시간마다 만료되거나, 포트폴리오 열람자(면접관/인사담당자)가 접속했을 때 외부 API 서버 장애 또는 Rate Limit으로 에러 화면이 나타날 위험이 존재했습니다.
- **해결책**:
  - API Key 미설정, 만료, 유효하지 않은 계정명, 혹은 API 장애 발생 시 자동으로 감지하여 현실적인 15개 경기 세부 데이터와 솔로랭크/자유랭크 정보가 포함된 `generateMockProfile` 모의 데이터 엔진으로 매끄럽게 폴백(Graceful Degradation).
  - UI 상단에 *"데모/시뮬레이션 전적 데이터"* 알림 배지를 자연스럽게 노출하여 서비스 중단 없는 완벽한 사용자 경험(UX)을 보장했습니다.

### 4) Next.js 서버리스 환경의 Mongoose 커넥션 싱글톤 패턴
- **문제점**:
  - Next.js의 개발 모드(HMR) 및 서버리스 라우트 핸들러 특성상 요청마다 새 DB 커넥션이 생성되어 `Too many connections` 에러 및 메모리 누수가 발생할 수 있습니다.
- **해결책**:
  - `lib/mongodb.ts`에 Node.js `global` 객체를 활용한 `MongooseCache` 싱글톤 패턴을 적용.
  - 한 번 맺어진 커넥션 프로미스를 전역 캐시에 보관하여 인스턴스를 안전하게 재사용하도록 구현했습니다.

### 5) 도커 멀티스테이지 빌드 & Standalone 모드로 컨테이너 경량화
- **문제점**:
  - 전체 Next.js 소스와 `node_modules`를 포함하여 이미지를 빌드하면 이미지 크기가 1GB를 초과하고 배포 속도가 저하됩니다.
- **해결책**:
  - `next.config.ts`의 `output: "standalone"` 설정을 활성화하여 프로덕션 실행에 필요한 최소 번들 파일만 추출.
  - `node:lts-alpine3.24` 기반 멀티스테이지(deps -> builder -> runner) Dockerfile을 작성하고 non-root 유저(`nextjs:nodejs`)를 생성하여 보안성과 가벼운 컨테이너 구동 환경을 확립했습니다.

---

## 📊 6. 화면 구성 (UI Architecture)

| 화면 | 주요 구성 요소 |
| :--- | :--- |
| **메인 홈 (`/`)** | • 그라디언트 히어로 헤더 & 브랜드 타이틀<br>• Riot ID 자동완성 지원 검색 바 (`SearchInput`)<br>• LCK 인기 소환사 퀵 링크 카드 (Hide on bush, Chovy 등)<br>• 서비스 3대 특장점 카드 및 Riot 저작권 Disclaimer 고지 |
| **소환사 상세 (`/summoner/[nameTag]`)** | • 소환사 레벨, 아이콘, 닉네임#태그<br>• 원클릭 실시간 전적 갱신 버튼 (`RefreshCw`)<br>• 솔로 랭크 / 자유 랭크 티어 카드<br>• 20경기 종합 통계 (승률 바, KDA, 킬관여, 딜비중)<br>• 모스트 선호 챔피언 TOP 3<br>• 5축 플레이스타일 방사형 레이더 차트 (`Recharts`) |
| **매치 히스토리 목록** | • 큐 타입 필터 탭 (전체 / 솔랭 / 자랭 / 칼바람)<br>• 승/패 카드 (블루/레드 보더), 챔피언, 룬, 스펠, 7종 템트리<br>• 아코디언 토글 클릭 시 블루/레드 10인 딜량 바 그래프 및 아이템 상세 노출 |

---

## 📈 7. 포트폴리오 요약 (Resume Bullet Points)

> **이력서 및 자기소개서에 바로 복사하여 활용할 수 있는 항목별 요약입니다.**

- **Riot Games API 기반 LoL 전적 검색 및 데이터 시각화 풀스택 웹 서비스 (KDA.KR) 1인 설계/개발**
- **계층형 캐싱 설계로 API Rate Limit 극복**: MongoDB TTL 인덱스(Account 30일, League 15분, Match 30일)를 적용하여 1회 조회당 23건 이상의 외부 API 호출을 90% 이상 절감.
- **데이터 다이어트(Data Pruning)**: 경기당 200KB 이상의 원본 매치 JSON에서 필요한 지표만 정제하여 **15KB 수준(90% 압축)**으로 줄여 DB 용량 및 네트워크 병목 해소.
- **배치 청크 병렬 처리**: 매치 20건 조회 시 5개씩 청크 분할(`Promise.all`) 처리하여 API 버스트 제한 회피 및 로딩 속도 대폭 개선.
- **고가용성 모의 데이터(Mock Fallback) 엔진 구현**: 서드파티 API 키 만료 및 Rate Limit 초과 시에도 정상적인 데모 체험이 가능하도록 우아한 성능 저하(Graceful Degradation) 설계.
- **Recharts 기반 5축 플레이스타일 방사형 차트 & 10인 딜량 비교 UI 개발**: 복잡한 게임 수치를 시각적으로 전달하여 사용자 경험(UX) 제고.
- **Docker Standalone 멀티스테이지 빌드 & PM2 운영 환경 구축**: Next.js 16 최신 App Router를 적용하고 경량화된 컨테이너 배포 파이프라인 구축.

---

## 🚀 8. 로컬 실행 방법 (Getting Started)

### 사전 준비
- Node.js 20+ 이상
- (선택) Riot Games API Key ([Riot Developer Portal](https://developer.riotgames.com/))
- (선택) MongoDB Atlas 연결 문자열 (미설정 시에도 Mock 모드로 완벽 작동)

### 1) 환경 변수 설정 (`.env.local`)
```env
RIOT_API_KEY=RGAPI-your-riot-api-key-here
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kda-kr?retryWrites=true&w=majority
```

### 2) 설치 및 개발 서버 실행
```bash
npm install
npm run dev
```
브라우저에서 `http://localhost:3000` 접속

### 3) Docker로 실행
```bash
docker compose up -d --build
```
