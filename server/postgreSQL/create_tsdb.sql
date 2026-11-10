CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(12)  NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(50)  NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  role        VARCHAR(10)  NOT NULL DEFAULT 'user'
              CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 초기 데이터 (연습용, 비밀번호 평문)
INSERT INTO users (username, password, name, email, role) VALUES
  ('admin', 'a1234',     '관리자', 'admin@spaceshop.com', 'admin'),
  ('hong',  'h1234',     '홍길동', 'hong@example.com',    'user');