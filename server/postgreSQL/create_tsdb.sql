
-- postgres(db)/postgres(계정) 접속 꼭 확인

-- 계정은 jsuser 사용

-- tsdb 생성(jsuser를 소유자로 지정)
CREATE DATABASE tsdb OWNER jsuser;

-- DB 삭제
DROP DATABASE tstd;