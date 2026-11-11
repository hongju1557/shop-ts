
### 쇼핑몰 프로젝트
1. UI(React)
   - 상품
   - 회원

2. 서버(Express)
   - DB : PostgreSQL
   - 상품 API
   - 회원 API

3. 운영(Render.com)
   - Static Site(UI) 
   - PostgreSQL
   - Web Service(서버) : Node

### 압축파일 기준 추가 기능
- 상품 등록을 서버 API와 연결하여 DB에 저장하고 목록을 다시 조회합니다.
- 상품 등록 시 제공된 상품 이미지를 선택할 수 있습니다.
- 회원 목록 조회, 회원가입, 로그인을 서버 API 및 DB와 연결합니다.
- 회원가입 성공 시 로그인 화면으로 이동합니다.
- 비로그인 상태에서 상품을 담으면 로그인 화면으로 안내합니다.
- 로그아웃 시 장바구니를 비우고 상품 목록으로 이동합니다.

### 실행 준비
- 기존 상품 DB는 유지하고, 회원 테이블이 없다면 `server/postgreSQL/tbl_users.sql`을 tsdb에서 한 번 실행합니다.
- 회원 SQL의 초기 계정은 학습용입니다. 압축파일과 동일하게 비밀번호를 평문으로 저장하며 세션/토큰 인증은 포함하지 않습니다.
- 서버: `cd server` → `npm install` → `npm start`
- 화면: `cd client` → `npm install` → `npm run dev`
- 검증: client에서 `npm run build`, `npm run lint`
