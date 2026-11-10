
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

### 구현된 기능
- 상품 조회 및 DB에 저장되는 상품 등록·수정·삭제 (상품 상세 화면에서 수정/삭제)
- DB 회원가입, 중복 아이디/이메일 처리, 로그인 결과 확인 후 화면 이동
- 저장 중 중복 제출 방지, 요청 실패 안내, 상품 목록 로딩/빈 목록 안내
- 관리자 대시보드, 장바구니는 기존 화면 유지

### 실행 및 검증
- 서버: `cd server` → `npm install` → `npm start`
- 클라이언트: `cd client` → `npm install` → `npm run dev`
- PostgreSQL 기본 연결: localhost의 `tsdb`, 계정 `jsuser`. 환경변수 `DATABASE_URL`로 변경 가능.
- 서버 포트는 `PORT` (기본 8000), 클라이언트 API 주소는 `VITE_API_URL` (기본 `http://localhost:8000/api`).
- 새 DB에서는 `server/postgreSQL/create_tsdb.sql`과 `tbl_products.sql`로 테이블을 준비합니다. 기존 테이블에는 다시 실행하지 않습니다.
- 프런트엔드 검증: `npm run build`, `npm run lint` (client 폴더)
- API 회귀 테스트: `npm test` (server 폴더). 테스트는 DB를 대체하므로 실제 데이터를 변경하지 않습니다.

`shop-ts.zip`과 비교한 결과 추가 파일 누락은 없었으며, 참고본에도 남아 있던 메모리 저장 방식을 현재 프로젝트의 API에 연결했습니다. 결제/주문 API는 참고본에 포함되어 있지 않습니다.
