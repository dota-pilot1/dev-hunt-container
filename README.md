# DevHunt

특정 개발 회사를 위한 채용 + 교육 프로젝트의 기본 보일러플레이트입니다.

기존 인증/인가 보일러플레이트에서 RBAC, 관리자 화면, DB 기반 메뉴, 다국어, 테마 시스템 구조를 가져오고 프로젝트 네이밍을 `DevHunt` 기준으로 변경했습니다.

## 구조

```text
dev-hunt-container/
├── dev-hunt-server       # Spring Boot API
├── dev-hunt-frontend     # Next.js frontend
├── docker-compose.yml    # PostgreSQL
└── README.md
```

## 기술 스택

| 영역 | 스택 |
| --- | --- |
| Frontend | Next.js 16, React 19, Tailwind v4, TanStack Query, react-hook-form, zod, i18next |
| Backend | Spring Boot, Spring Security, Spring Data JPA, JWT |
| DB | PostgreSQL 15 |
| Infra | Docker Compose |

## 주요 기능

- 이메일 회원가입 / 로그인
- JWT Access / Refresh Token
- 역할(Role), 권한(Permission), 권한 카테고리 관리
- 역할-권한 매핑
- 사용자 역할 변경
- 관리자 전용 페이지 가드
- DB 기반 헤더 메뉴
- 테마 스위처
- 한국어 / 영어 / 일본어 / 중국어 다국어 구조

## Backend

Java 루트 패키지:

```text
com.cj.devhunt
```

실행:

```bash
cd dev-hunt-server
cp .env.example .env
./gradlew bootRun
```

- API: `http://localhost:4101`
- Swagger: `http://localhost:4101/swagger-ui/index.html`

## Frontend

실행:

```bash
cd dev-hunt-frontend
npm install
npm run dev
```

- URL: `http://localhost:4300`

## Database

```bash
docker compose up -d postgres
```

| 항목 | 값 |
| --- | --- |
| Host | localhost |
| Port | 5435 |
| Database | dev_hunt |
| Username | postgres |
| Password | postgres |

## 초기 데이터

서버 시작 시 기본 권한/역할/메뉴 시더가 실행됩니다.

- `ROLE_ADMIN`
- `ROLE_MANAGER`
- `ROLE_USER`
- 기본 권한 카테고리
- 기본 메뉴 트리

첫 번째 가입자는 `ROLE_ADMIN`, 이후 가입자는 `ROLE_USER`로 생성됩니다.
